import { json, requireSql } from './_lib/db.js';
import { createHash } from 'node:crypto';
import process from 'node:process';

const categories = ['Hubungan Sehat', 'Kesiapan Masa Depan', 'Komunikasi dan Batasan Diri', 'Budaya dan Nilai Keluarga Bali', 'Tanya Jawab'];
const cleanText = (value, max) => String(value || '').replace(/\p{Cc}/gu, '').trim().slice(0, max);
const validId = (value) => /^\d{1,18}$/.test(String(value || ''));
const isModerator = (req) => {
  const token = String(req.headers?.authorization || '').replace(/^Bearer\s+/i, '');
  return Boolean(process.env.SADAYA_YOWANA_MODERATOR_TOKEN && token === process.env.SADAYA_YOWANA_MODERATOR_TOKEN);
};
const enforceRateLimit = async (sql, req, action, seconds) => {
  const forwarded = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = forwarded || req.socket?.remoteAddress || 'unknown';
  const digest = createHash('sha256').update(ip).digest('hex');
  const rows = await sql`insert into yowana_rate_limits (ip_hash, action, next_allowed_at)
    values (${digest}, ${action}, now() + (${seconds} * interval '1 second'))
    on conflict (ip_hash, action) do update set next_allowed_at = excluded.next_allowed_at
    where yowana_rate_limits.next_allowed_at <= now()
    returning ip_hash`;
  return rows.length > 0;
};

export default async function handler(req, res) {
  try {
    const sql = requireSql();
    if (req.method === 'GET') {
      const events = await sql`select id, title, speaker_name, organizer_name, starts_at, description
        from yowana_events where hidden = false and starts_at >= now() - interval '1 day'
        order by starts_at asc limit 50`;
      const rows = await sql`select id, title, category, author_name, content, created_at, locked, hidden,
        (select count(*)::int from yowana_replies r where r.topic_id = t.id and r.hidden = false) as reply_count,
        (select coalesce(json_agg(json_build_object('id', r.id, 'author', r.author_name, 'content', r.content, 'createdAt', r.created_at, 'isModerator', r.is_moderator) order by r.created_at asc), '[]'::json)
          from yowana_replies r where r.topic_id = t.id and r.hidden = false) as replies
        from yowana_topics t where hidden = false order by created_at desc limit 100`;
      return json(res, 200, { ok: true, events: events.map((event) => ({ id: String(event.id), title: event.title, speaker: event.speaker_name, organizer: event.organizer_name, startsAt: event.starts_at, description: event.description })), topics: rows.map((row) => ({ id: String(row.id), title: row.title, category: row.category, author: row.author_name, content: row.content, createdAt: row.created_at, locked: row.locked, replyCount: Number(row.reply_count), replies: row.replies || [] })) });
    }
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Metode tidak diizinkan.' });
    const { action } = req.body || {};
    if (action === 'create') {
      if (String(req.body.title || '').length > 120 || String(req.body.content || '').length > 2000 || String(req.body.author || '').length > 32) return json(res, 400, { ok: false, error: 'Ada isian yang melewati batas karakter.' });
      const title = cleanText(req.body.title, 120), category = cleanText(req.body.category, 80), author = cleanText(req.body.author, 32), content = cleanText(req.body.content, 2000);
      if (title.length < 8 || content.length < 20 || author.length < 2 || !categories.includes(category)) return json(res, 400, { ok: false, error: 'Periksa kembali judul (8–120 karakter), isi (20–2.000 karakter), nama (2–32 karakter), dan kategori.' });
      if (!await enforceRateLimit(sql, req, 'create', 30)) return json(res, 429, { ok: false, error: 'Terlalu cepat mengirim diskusi. Coba lagi sebentar.' });
      const rows = await sql`insert into yowana_topics (title, category, author_name, content) values (${title}, ${category}, ${author}, ${content}) returning id, created_at`;
      return json(res, 201, { ok: true, id: String(rows[0].id), createdAt: rows[0].created_at });
    }
    if (action === 'reply') {
      if (String(req.body.content || '').length > 1000 || String(req.body.author || '').length > 32) return json(res, 400, { ok: false, error: 'Ada isian yang melewati batas karakter.' });
      const topicId = String(req.body.topicId || ''), author = cleanText(req.body.author, 32), content = cleanText(req.body.content, 1000);
      if (!validId(topicId) || author.length < 2 || content.length < 2) return json(res, 400, { ok: false, error: 'Balasan atau nama belum valid.' });
      const topics = await sql`select locked, hidden from yowana_topics where id = ${topicId} limit 1`;
      if (!topics.length || topics[0].hidden) return json(res, 404, { ok: false, error: 'Diskusi tidak ditemukan.' });
      if (topics[0].locked) return json(res, 409, { ok: false, error: 'Diskusi ini sudah dikunci.' });
      if (!await enforceRateLimit(sql, req, 'reply', 10)) return json(res, 429, { ok: false, error: 'Terlalu cepat mengirim balasan. Coba lagi sebentar.' });
      await sql`insert into yowana_replies (topic_id, author_name, content) values (${topicId}, ${author}, ${content})`;
      return json(res, 201, { ok: true });
    }
    if (action === 'moderator-reply') {
      if (!isModerator(req)) return json(res, 403, { ok: false, error: 'Akses pengurus tidak terverifikasi.' });
      const topicId = String(req.body.topicId || ''), content = cleanText(req.body.content, 1000);
      if (!validId(topicId) || String(req.body.content || '').length > 1000 || content.length < 2) return json(res, 400, { ok: false, error: 'Balasan moderator belum valid.' });
      const topics = await sql`select locked, hidden from yowana_topics where id = ${topicId} limit 1`;
      if (!topics.length || topics[0].hidden) return json(res, 404, { ok: false, error: 'Diskusi tidak ditemukan.' });
      if (topics[0].locked) return json(res, 409, { ok: false, error: 'Diskusi ini sudah dikunci.' });
      if (!await enforceRateLimit(sql, req, 'reply', 10)) return json(res, 429, { ok: false, error: 'Terlalu cepat mengirim balasan. Coba lagi sebentar.' });
      await sql`insert into yowana_replies (topic_id, author_name, content, is_moderator) values (${topicId}, 'Moderator SADAYA', ${content}, true)`;
      return json(res, 201, { ok: true });
    }
    if (action === 'report') {
      const kind = req.body.kind === 'reply' ? 'reply' : 'topic', targetId = String(req.body.targetId || ''), reason = cleanText(req.body.reason || 'Lainnya', 250);
      if (!validId(targetId)) return json(res, 400, { ok: false, error: 'Konten yang dilaporkan tidak valid.' });
      if (!await enforceRateLimit(sql, req, 'report', 30)) return json(res, 429, { ok: false, error: 'Laporan baru saja dikirim. Coba lagi nanti.' });
      await sql`insert into yowana_reports (target_type, target_id, reason) values (${kind}, ${targetId}, ${reason})`;
      return json(res, 201, { ok: true, message: 'Laporan diterima untuk ditinjau pengurus.' });
    }
    if (action === 'moderate') {
      if (!isModerator(req)) return json(res, 403, { ok: false, error: 'Akses pengurus tidak terverifikasi.' });
      const operation = req.body.operation;
      if (operation === 'reports') {
        const reports = await sql`select id, target_type, target_id, reason, created_at from yowana_reports where resolved = false order by created_at asc limit 100`;
        const topics = await sql`select id, title, content from yowana_topics where id in (select target_id::bigint from yowana_reports where resolved = false and target_type = 'topic')`;
        const replies = await sql`select id, content from yowana_replies where id in (select target_id::bigint from yowana_reports where resolved = false and target_type = 'reply')`;
        return json(res, 200, { ok: true, reports: reports.map((report) => ({ ...report, target: (report.target_type === 'topic' ? topics : replies).find((item) => String(item.id) === String(report.target_id)) || null })) });
      }
      if (operation === 'create-event') {
        const title = cleanText(req.body.title, 120), speaker = cleanText(req.body.speaker, 80), organizer = cleanText(req.body.organizer, 120), description = cleanText(req.body.description, 500);
        const startsAt = new Date(req.body.startsAt);
        if (String(req.body.title || '').length > 120 || String(req.body.speaker || '').length > 80 || String(req.body.organizer || '').length > 120 || String(req.body.description || '').length > 500 || title.length < 8 || speaker.length < 2 || organizer.length < 2 || description.length < 15 || Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) return json(res, 400, { ok: false, error: 'Periksa judul, nama narasumber/STT, deskripsi, serta tanggal dan waktu diskusi.' });
        const inserted = await sql`insert into yowana_events (title, speaker_name, organizer_name, starts_at, description)
          values (${title}, ${speaker}, ${organizer}, ${startsAt.toISOString()}, ${description}) returning id`;
        return json(res, 201, { ok: true, id: String(inserted[0].id) });
      }
      const targetId = String(req.body.targetId || '');
      if (!validId(targetId)) return json(res, 400, { ok: false, error: 'ID konten tidak valid.' });
      if (operation === 'hide-topic') await sql`update yowana_topics set hidden = true where id = ${targetId}`;
      else if (operation === 'hide-reply') await sql`update yowana_replies set hidden = true where id = ${targetId}`;
      else if (operation === 'lock-topic') await sql`update yowana_topics set locked = not locked where id = ${targetId}`;
      else if (operation === 'delete-topic') await sql`delete from yowana_topics where id = ${targetId}`;
      else if (operation === 'delete-reply') await sql`delete from yowana_replies where id = ${targetId}`;
      else if (operation === 'delete-event') await sql`delete from yowana_events where id = ${targetId}`;
      else if (operation === 'resolve-report') await sql`update yowana_reports set resolved = true where id = ${targetId}`;
      else return json(res, 400, { ok: false, error: 'Aksi moderasi tidak dikenal.' });
      return json(res, 200, { ok: true });
    }
    return json(res, 400, { ok: false, error: 'Aksi tidak dikenal.' });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message || 'Terjadi kesalahan server.' });
  }
}
