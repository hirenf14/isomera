import { ValidateableDto } from '../../generics/Validateable.dto'
import { ApiProperty } from '@nestjs/swagger'

export class TurnOff2FADto extends ValidateableDto {
  @ApiProperty()
  code!: string
}
