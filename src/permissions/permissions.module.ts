import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from './schemas/role.schema'
import { Permission, PermissionSchema } from './schemas/permission.schema'

export const PermissionsMongoose = MongooseModule.forFeature([
  { name: Role.name, schema: RoleSchema },
  { name: Permission.name, schema: PermissionSchema },
])

@Module({
  imports: [PermissionsMongoose],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
