import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function isNotNullOnValue(property: string, valueToCompare?, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, valueToCompare],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isNotNullOnValue' })
export class MatchConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName, valueToCompare] = args.constraints;

    const relatedValue = (args.object as any)[relatedPropertyName];

    if (value && !relatedValue) {
      if (valueToCompare && valueToCompare != relatedValue)
        return 
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} must be supplied when ${args.property} is supplied`;
  }
}
