import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';


@Injectable()
export class AuthService{
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ){ }

    async validateUser(usuario: string, senha: string): Promise<any>{

        const buscaUsuario = await this.usuarioService.findByUsuario(usuario)

        if(!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND)

        const validaSenha = await this.bcrypt.compararSenhas(senha, buscaUsuario.senha)

        if(buscaUsuario && validaSenha){
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null

    }

    async login(usuarioLogin: UsuarioLogin){

        const payload = { sub: usuarioLogin.usuario }

        const buscaUsuario = await this.usuarioService.findByUsuario(usuarioLogin.usuario)

        return{
            id: buscaUsuario.id,
            nome: buscaUsuario.nome,
            usuario: usuarioLogin.usuario,
            senha: '',
            foto: buscaUsuario.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        }

    }
}