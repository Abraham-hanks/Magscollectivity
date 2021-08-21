import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(
  PickType(CreateCustomerDto,
    [
      'firstname',
      'lastname',
      'middlename',
      'phone',
      // 'email',
      'profile_pic',
      'dob',
      'gender',
      'address',
      'marital_status',
      'occupation',
      'state_id',
      'lga_id',
      'state_name', // update the name too
      'lga_name',
      'country',
      'next_of_kin_address',
      'next_of_kin_full_name',
      'next_of_kin_phone',
      'next_of_relationship'
    ] as const),
) {
  // @IsOptional()
  // @ApiHideProperty()
  // updated_by_id?: number;
}
