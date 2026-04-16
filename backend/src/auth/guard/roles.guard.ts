import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import { request } from "http";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorator/roles/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector : Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);
        if(!requireRoles) {return true}
        const {user} = context.switchToHttp().getRequest();
        if(!user) {return false}
        const hasRole = requireRoles.includes(user.role);
        if(!hasRole) {
            throw new ForbiddenException('Bạn không có quyền truy cập chức năng này');
        }
        return true;
    }
    
}