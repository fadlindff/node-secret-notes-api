/* eslint-disable consistent-return */
const express = require('express');

const { nanoid } = require('nanoid');

const connection = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM notes';

  connection.query(query, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ada kesalahan', error: true });

    res.status(200).json({ error: false, message: 'Berhasil mendapatkan data', data: rows });

    return true;
  });
});

router.post('/', (req, res) => {
  const data = { ...req.body };
  const secretKey = nanoid(16);
  const query = `INSERT INTO notes (title, body, secret_key) VALUES ('${data.title}', '${data.body}', '${secretKey}')`;

  connection.query(query, data, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menambahkan data!', error: true });

    res.status(201).json({ error: false, message: 'Berhasil menambahkan data.', secret_key: secretKey });

    return true;
  });
});

router.get('/:key', (req, res) => {
  const { key } = req.params;
  const query = 'SELECT * FROM notes WHERE secret_key = ?';

  connection.query(query, key, (err, rows) => {
    if (err) return res.status(500).json({ error: true, message: err });

    if (rows.length <= 0) return res.status(404).json({ error: true, message: 'Notes tidak ditemukan' });

    res.status(201).json({ error: false, message: 'Sukses menampilkan data', data: rows[0] });
  });
  return true;
});

router.put('/:key', (req, res) => {
  const { key } = req.params;
  const newData = { ...req.body };
  const selectQuery = 'SELECT * FROM notes WHERE secret_key = ?';
  const updateQuery = 'UPDATE notes SET ? WHERE secret_key = ?';

  connection.query(selectQuery, key, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message, error: true });

    if (rows.length <= 0) return res.status(404).json({ message: 'Notes tidak ditemukan', error: true });

    connection.query(updateQuery, [newData, key], () => {
      res.status(201).json({ message: 'Notes berhasil diupdate', error: false });
    });
  });
});

router.delete('/:key', (req, res) => {
  const { key } = req.params;
  const query = 'DELETE FROM notes WHERE secret_key = ?';

  connection.query('SELECT * FROM notes WHERE secret_key = ?', key, (err, rows) => {
    if (err) return res.status(500).json({ message: err.message, error: true });

    if (rows.length <= 0) return res.status(404).json({ message: 'Notes tidak ditemukan', error: true });

    connection.query(query, key, () => {
      res.status(201).json({ message: 'Data berhasil dihapus', error: false });
    });
  });
});

module.exports = router;
