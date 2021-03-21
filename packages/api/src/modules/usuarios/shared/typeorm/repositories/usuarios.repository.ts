// import { getRepository, Repository, Not } from 'typeorm';
// import Usuario from '../models/usuario';

// class UsersRepository implements IUsersRepository {
//   private ormRepository: Repository<Usuario>;

//   constructor() {
//     this.ormRepository = getRepository(Usuario);
//   }

//   public async findById(id: string): Promise<Usuario | undefined> {
//     const user = await this.ormRepository.findOne(id);

//     return user;
//   }

//   public async findByEmail(email: string): Promise<Usuario | undefined> {
//     const user = await this.ormRepository.findOne({
//       where: { email },
//     });

//     return user;
//   }

//   public async findAllProviders({
//     except_user_id,
//   }: IFindAllProvidersDTO): Promise<Usuario[]> {
//     let users: Usuario[];

//     if (except_user_id) {
//       users = await this.ormRepository.find({
//         where: {
//           id: Not(except_user_id),
//         },
//       });
//     } else {
//       users = await this.ormRepository.find();
//     }

//     return users;
//   }

//   public async create(userData: ICreateUsertDTO): Promise<Usuario> {
//     const appointment = this.ormRepository.create(userData);

//     await this.ormRepository.save(appointment);

//     return appointment;
//   }

//   public async save(user: Usuario): Promise<Usuario> {
//     return this.ormRepository.save(user);
//   }
// }

// export default UsersRepository;
