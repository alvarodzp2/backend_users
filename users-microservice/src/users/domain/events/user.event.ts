export class UserCreatedEvent {
  constructor(public readonly userId: string, public readonly payload: any) {}
}

export class UserUpdatedEvent {
  constructor(public readonly userId: string, public readonly payload: any) {}
}

export class UserDeletedEvent {
  constructor(public readonly userId: string) {}
}
