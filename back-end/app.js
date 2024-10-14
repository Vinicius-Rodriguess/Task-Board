const express = require("express")
const app = express()
const cors = require("cors")
const Sequelize = require("sequelize")

app.use(cors())
app.use(express.json())

const sequelize = new Sequelize("###", "###", "###", {
    host: "###",
    dialect: "###"
})

sequelize.sync()

const Note = sequelize.define("notes", {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fixed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
})

app.post("/", async (req, res) => {
    try {
        await Note.create({
            id: req.body.id,
            content: req.body.content,
            fixed: req.body.fixed
        })
        res.status(200).json({ msg: "Nota criada com sucesso" })
    } catch (err) {
        res.status(500).json({ msg: "Erro ao criar nota: " + err.message })
    }
})

app.get("/", async (req, res) => {
    try {
        const notes = await Note.findAll({
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json(notes)
    } catch (err) {
        res.status(500).json({ msg: "Erro ao recuperar notas: " + err.message })
    }
})

app.get("/delete/:id", async (req, res) => {
    try {
        const result = await Note.destroy({
            where: { id: req.params.id }
        })

        if (result === 0) {
            return res.status(404).json({ msg: "Nota não encontrada" })
        }

        res.status(204).json({ msg: "Nota deletada com sucesso" })
    } catch (err) {
        res.status(500).json({ msg: "Erro ao deletar nota" + err })
    }
})

app.put("/update/:id", async (req, res) => {
    try {
        const [updated] = await Note.update(req.body, {
            where: { id: req.params.id }
        })

        if (updated) {
            res.status(200).json({ msg: "Nota atualizada com sucesso" })
        } else {
            res.status(404).json({ msg: "Nota não encontrada" })
        }
    } catch (err) {
        res.status(500).json({ msg: "Erro ao atualizar nota: " + err.message })
    }
})

const port = 8080
app.listen(port, () => {
    console.log(`Servidor rodando na url http://localhost:${port}`)
})