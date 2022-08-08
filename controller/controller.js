const db = require('../db')
const uuid = require('uuid')
var CryptoJS = require("crypto-js");

class Controller {

    async generate(req, res) {
        const { passphrase, text } = req.body
        const encrypted = CryptoJS.AES.encrypt(text, passphrase).toString();
        const secret_key = uuid.v4()
        const a = await db.query(`INSERT INTO link (text,secretkey) values($1,$2) RETURNING *`, [encrypted, secret_key])
        const link = 'http://localhost:8080/api/secrets/' + secret_key
        res.json(link)
    }

    async secrets(req, res) {
        const secret_key = req.params.secret_key;
        const { passphrase } = req.body
        const cortege = await db.query(`SELECT * FROM link WHERE secretkey = $1`, [secret_key])
        if (cortege.rows.length !== 0) {
            const encrypted = cortege.rows[0].text
            const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted !== '') {
                res.json('Ваш секрет: ' + decrypted)
                await db.query(`DELETE FROM link WHERE id = $1`, [cortege.rows[0].id])
            }
            else { res.json('Неверная секретная фраза') }
        }
        else { res.json('Неверная ссылка') }
    }
}
module.exports = new Controller()