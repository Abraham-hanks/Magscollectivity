import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CURRENT_DATE } from 'src/common/constants';
import { isFutureDate as isDateFuture } from '../../utils/date-processor';

export function isFutureDate(property?: string | Date, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isFutureDate' })
export class MatchConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {

    return isDateFuture(value);
      // return isValidDate(value) && isFutureDate(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be a date after ${relatedPropertyName || CURRENT_DATE}`;
  }
}
