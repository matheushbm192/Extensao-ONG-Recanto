import { Request, Response } from 'express'
import path from 'path'

export const getTelaHome = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'pages', 'home.html')
        res.sendFile(filePath)
    } catch (error) {
        res.send(error)
    }

}
export const getTelaAdocao = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'pages', 'adocao.html')
        res.sendFile(filePath)
    } catch (error) {
        res.send(error)
    }
}
export const getTelaCadastrarAnimais = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'pages', 'cadastrarAnimais.html')
        res.sendFile(filePath)
    } catch (error) {
        res.send(error)
    }
}
export const getTelaLogin = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'pages', 'login.html')
        res.sendFile(filePath)
    } catch (error) {
        res.send(error)
    }
}

