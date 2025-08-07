import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function autenticarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    console.log("DECODED TOKEN")
    console.log(decoded)

    req.body = { ...req.body, ...decoded };
    next();
  });
}
