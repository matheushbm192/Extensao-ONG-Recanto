import { Request, Response } from 'express'
import { AnimaisAdotadosRN } from "../services/animaisAdotadosService";
import { MulterRequest } from '../interfaceConfig/MulterRequest';

const animaisAdotadosRN = new AnimaisAdotadosRN();

export class AnimaisAdotadosCTR {
    async getAnimaisAdotadosByUsuarioId(req: MulterRequest, res: Response) {
        try {
            
            console.log("REQUEST CONTROLLER")
            console.log(req.body)

            console.log("ANIMAIS ADOTADOOOO")
            
            const id_usuario = req.body.id_usuario; 
            
            const animaisAdotados = await animaisAdotadosRN.selectAnimaisAdotadoByUsuarioId(id_usuario);
            console.log("CONTROLLER ANIMAIS ADOTADOS")
            console.log(animaisAdotados)

            return res.status(200).json({ animaisAdotados });
        } catch (error: any) {
            console.error("Erro ao buscar animais:", error);
            res.status(500).json({ error: error.message });
        }
    }
}
