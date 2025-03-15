import { plainToClass } from 'class-transformer'

interface ClassType<T> {
  new (): T
}

export const modelMapper = <T, V>(cls: ClassType<T>, painObject: V): T => {
  return plainToClass(cls, JSON.parse(JSON.stringify(painObject)), {
    excludeExtraneousValues: true,
  })
}
