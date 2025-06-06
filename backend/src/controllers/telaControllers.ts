import { Request, Response } from 'express'

export const getTelaHome = async (req: Request, res: Response) => {
    try {
        res.sendFile('../pages/home')
    } catch (error) {
        res.send(error)
    }

}
export const getTelaAdocao = async (req: Request, res: Response) => {
    try {
        res.sendFile('../pages/adocao')
    } catch (error) {
        res.send(error)
    }
}
export const getTelaCadastrarAnimais = async (req: Request, res: Response) => {
    try {
        res.sendFile('../pages/cadastrarAnimais')
    } catch (error) {
        res.send(error)
    }
}

