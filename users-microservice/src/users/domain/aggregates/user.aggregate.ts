import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from '../events/user.event';

export class UserAggregate {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public cedula: string,
    public role: string,
    public status: boolean,
  ) {}

  static async create(props: {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    cedula: string,
    role?: string,
    status?: boolean,
  }): Promise<{ aggregate: UserAggregate; event: UserCreatedEvent }> {
    const { v4: uuidv4 } = await import('uuid'); // dynamic import
    const id = props.id ?? uuidv4();

    const aggregate = new UserAggregate(
      id,
      props.firstName,
      props.lastName,
      props.email,
      props.cedula,
      props.role || 'viewer',
      props.status ?? true,
    );

    const event = new UserCreatedEvent(id, {
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      cedula: props.cedula,
      role: props.role || 'viewer',
      status: props.status ?? true,
    });

    return { aggregate, event };
  }

  update(props: { firstName?: string; lastName?: string; email?: string; role?: string; status?: boolean }) {
    if (props.firstName) this.firstName = props.firstName;
    if (props.lastName) this.lastName = props.lastName;
    if (props.email) this.email = props.email;
    if (props.role) this.role = props.role;
    if (props.status !== undefined) this.status = props.status;

    return new UserUpdatedEvent(this.id, {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      status: this.status,
    });
  }

  delete() {
    this.status = false;
    return new UserDeletedEvent(this.id);
  }
}
