import { Request, Response } from 'express'
import { AnimaisAdotadosRN } from "../services/animaisAdotadosService";
import { MulterRequest } from '../interfaceConfig/MulterRequest';

const animaisAdotadosRN = new AnimaisAdotadosRN();

export class AnimaisAdotadosCTR {
    async getAllAnimaisAdotados(req: MulterRequest, res: Response) {
        try {
            const animaisAdotados = await animaisAdotadosRN.selectAllAnimaisAdotados();
            console.log("CONTROLLER ANIMAIS ADOTADOS")
            console.log(animaisAdotados)
            return res.status(200).json({ animaisAdotados });
        } catch (error: any) {
            console.error("Erro ao buscar animais:", error);
            res.status(500).json({ error: error.message });
        }
    }
}
