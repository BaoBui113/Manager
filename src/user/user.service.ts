import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { User } from '../entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../user_roles/entities/user_role.entity';
import { CreateEmployeeWithUserDto } from './user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
  async seedUsers() {
    console.log('Starting users and employees seeding...');

    const usersData = [
      // CEO
      {
        email: 'ceo@company.com',
        password: 'CEO123456',
        employee: {
          full_name: 'John Smith',
          phone: '0901234567',
          gender: 'male',
          address: '123 CEO Street, District 1, HCMC',
          dob: '15/01/1975',
          position: 'Chief Executive Officer',
          department: 'Executive',
          salary: 50000000,
        },
        roles: ['ceo', 'admin'],
      },

      // CTO
      {
        email: 'cto@company.com',
        password: 'CTO123456',
        employee: {
          full_name: 'Jane Wilson',
          phone: '0901234568',
          gender: 'female',
          address: '456 Tech Avenue, District 2, HCMC',
          dob: '20/03/1980',
          position: 'Chief Technology Officer',
          department: 'Technology',
          salary: 45000000,
        },
        roles: ['cto', 'admin'],
      },

      // Department Heads
      {
        email: 'it.head@company.com',
        password: 'ITHead123456',
        employee: {
          full_name: 'Michael Johnson',
          phone: '0901234569',
          gender: 'male',
          address: '789 IT Plaza, District 3, HCMC',
          dob: '10/07/1982',
          position: 'IT Department Head',
          department: 'Information Technology',
          salary: 35000000,
        },
        roles: ['department_head'],
      },

      {
        email: 'hr.head@company.com',
        password: 'HRHead123456',
        employee: {
          full_name: 'Sarah Davis',
          phone: '0901234570',
          gender: 'female',
          address: '321 HR Building, District 4, HCMC',
          dob: '25/11/1978',
          position: 'HR Department Head',
          department: 'Human Resources',
          salary: 30000000,
        },
        roles: ['department_head', 'hr_manager'],
      },

      // Managers
      {
        email: 'dev.manager@company.com',
        password: 'Manager123456',
        employee: {
          full_name: 'Robert Brown',
          phone: '0901234571',
          gender: 'male',
          address: '654 Developer Street, District 5, HCMC',
          dob: '14/09/1985',
          position: 'Development Manager',
          department: 'Information Technology',
          salary: 25000000,
        },
        roles: ['manager'],
      },

      {
        email: 'qa.manager@company.com',
        password: 'QAManager123456',
        employee: {
          full_name: 'Lisa Anderson',
          phone: '0901234572',
          gender: 'female',
          address: '987 QA Center, District 6, HCMC',
          dob: '08/12/1987',
          position: 'QA Manager',
          department: 'Quality Assurance',
          salary: 22000000,
        },
        roles: ['manager', 'qa_lead'],
      },

      // Team Leaders
      {
        email: 'frontend.lead@company.com',
        password: 'Lead123456',
        employee: {
          full_name: 'David Lee',
          phone: '0901234573',
          gender: 'male',
          address: '147 Frontend Hub, District 7, HCMC',
          dob: '22/04/1990',
          position: 'Frontend Team Leader',
          department: 'Information Technology',
          salary: 20000000,
        },
        roles: ['team_leader', 'tech_lead'],
      },

      {
        email: 'backend.lead@company.com',
        password: 'BackendLead123456',
        employee: {
          full_name: 'Emily Chen',
          phone: '0901234574',
          gender: 'female',
          address: '258 Backend Tower, District 8, HCMC',
          dob: '17/06/1988',
          position: 'Backend Team Leader',
          department: 'Information Technology',
          salary: 20000000,
        },
        roles: ['team_leader', 'tech_lead'],
      },

      // Project Managers
      {
        email: 'pm1@company.com',
        password: 'PM123456',
        employee: {
          full_name: 'Mark Thompson',
          phone: '0901234575',
          gender: 'male',
          address: '369 Project Lane, District 9, HCMC',
          dob: '11/02/1986',
          position: 'Project Manager',
          department: 'Information Technology',
          salary: 18000000,
        },
        roles: ['project_manager'],
      },

      {
        email: 'pm2@company.com',
        password: 'PM2123456',
        employee: {
          full_name: 'Anna Rodriguez',
          phone: '0901234576',
          gender: 'female',
          address: '741 Management Street, District 10, HCMC',
          dob: '30/08/1989',
          position: 'Product Manager',
          department: 'Product Development',
          salary: 18000000,
        },
        roles: ['product_manager', 'project_manager'],
      },

      // Senior Developers
      {
        email: 'senior.dev1@company.com',
        password: 'SeniorDev123456',
        employee: {
          full_name: 'Tom Wilson',
          phone: '0901234577',
          gender: 'male',
          address: '852 Senior Dev Road, District 11, HCMC',
          dob: '05/01/1991',
          position: 'Senior Full-stack Developer',
          department: 'Information Technology',
          salary: 16000000,
        },
        roles: ['senior_developer'],
      },

      {
        email: 'senior.dev2@company.com',
        password: 'SeniorDev2123456',
        employee: {
          full_name: 'Grace Kim',
          phone: '0901234578',
          gender: 'female',
          address: '963 Code Avenue, District 12, HCMC',
          dob: '28/05/1990',
          position: 'Senior Backend Developer',
          department: 'Information Technology',
          salary: 16000000,
        },
        roles: ['senior_developer'],
      },

      // Developers
      {
        email: 'dev1@company.com',
        password: 'Dev123456',
        employee: {
          full_name: 'Alex Johnson',
          phone: '0901234579',
          gender: 'male',
          address: '159 Developer Circle, Tan Binh, HCMC',
          dob: '12/03/1993',
          position: 'Full-stack Developer',
          department: 'Information Technology',
          salary: 12000000,
        },
        roles: ['developer'],
      },

      {
        email: 'dev2@company.com',
        password: 'Dev2123456',
        employee: {
          full_name: 'Sophie Martinez',
          phone: '0901234580',
          gender: 'female',
          address: '357 Code Street, Binh Thanh, HCMC',
          dob: '19/07/1994',
          position: 'Frontend Developer',
          department: 'Information Technology',
          salary: 11000000,
        },
        roles: ['developer'],
      },

      // Junior Developers
      {
        email: 'junior.dev1@company.com',
        password: 'JuniorDev123456',
        employee: {
          full_name: 'Ryan Lee',
          phone: '0901234581',
          gender: 'male',
          address: '468 Junior Lane, Thu Duc, HCMC',
          dob: '23/11/1996',
          position: 'Junior Frontend Developer',
          department: 'Information Technology',
          salary: 8000000,
        },
        roles: ['junior_developer'],
      },

      {
        email: 'junior.dev2@company.com',
        password: 'JuniorDev2123456',
        employee: {
          full_name: 'Maya Patel',
          phone: '0901234582',
          gender: 'female',
          address: '579 Newbie Road, Go Vap, HCMC',
          dob: '16/09/1997',
          position: 'Junior Backend Developer',
          department: 'Information Technology',
          salary: 8000000,
        },
        roles: ['junior_developer'],
      },

      // QA Engineers
      {
        email: 'qa1@company.com',
        password: 'QA123456',
        employee: {
          full_name: 'Kevin Zhang',
          phone: '0901234583',
          gender: 'male',
          address: '680 QA Boulevard, District 1, HCMC',
          dob: '07/04/1992',
          position: 'QA Engineer',
          department: 'Quality Assurance',
          salary: 10000000,
        },
        roles: ['qa_engineer'],
      },

      // HR Staff
      {
        email: 'hr.specialist@company.com',
        password: 'HRSpec123456',
        employee: {
          full_name: 'Jessica Wang',
          phone: '0901234584',
          gender: 'female',
          address: '791 HR Plaza, District 2, HCMC',
          dob: '13/08/1991',
          position: 'HR Specialist',
          department: 'Human Resources',
          salary: 12000000,
        },
        roles: ['hr_specialist'],
      },

      // System Admin
      {
        email: 'sysadmin@company.com',
        password: 'SysAdmin123456',
        employee: {
          full_name: 'Chris Taylor',
          phone: '0901234585',
          gender: 'male',
          address: '902 System Lane, District 3, HCMC',
          dob: '26/10/1988',
          position: 'System Administrator',
          department: 'Information Technology',
          salary: 15000000,
        },
        roles: ['system_admin', 'admin'],
      },

      // Regular Employees
      {
        email: 'employee1@company.com',
        password: 'Employee123456',
        employee: {
          full_name: 'John Doe',
          phone: '0901234586',
          gender: 'male',
          address: '123 Employee Street, District 4, HCMC',
          dob: '15/12/1995',
          position: 'Marketing Specialist',
          department: 'Marketing',
          salary: 9000000,
        },
        roles: ['employee'],
      },

      // Intern
      {
        email: 'intern1@company.com',
        password: 'Intern123456',
        employee: {
          full_name: 'Alice Green',
          phone: '0901234587',
          gender: 'female',
          address: '456 Intern Avenue, District 5, HCMC',
          dob: '20/01/1999',
          position: 'Software Development Intern',
          department: 'Information Technology',
          salary: 3000000,
        },
        roles: ['intern'],
      },
    ];

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const userData of usersData) {
      try {
        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
          where: { email: userData.email },
        });

        if (existingUser) {
          console.log(`User already exists: ${userData.email}`);
          totalSkipped++;
          continue;
        }

        // Create employee first - Sử dụng cách explicit type casting
        const dobDate = this.parseDate(userData.employee.dob);

        // Tạo object employee một cách rõ ràng
        const employeeData = {
          full_name: userData.employee.full_name,
          phone: userData.employee.phone,
          gender: userData.employee.gender,
          address: userData.employee.address,
          dob: dobDate,
          joined_date: new Date(),
          position: userData.employee.position,
          department: userData.employee.department,
          salary: userData.employee.salary,
          is_active: true,
        };

        // Sử dụng new Employee() thay vì repository.create()
        const employee = new Employee();
        employee.full_name = userData.employee.full_name;
        employee.phone = userData.employee.phone;
        employee.gender = userData.employee.gender;
        employee.address = userData.employee.address;
        employee.dob = dobDate;
        employee.joined_date = new Date();

        const savedEmployee = await this.employeeRepository.save(employee);

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user with employee reference
        const user = new User();
        user.email = userData.email;
        user.password = hashedPassword;
        user.is_active = true;
        user.employee = savedEmployee;
        user.employee_id = savedEmployee.id;

        const savedUser = await this.userRepository.save(user);

        // Assign roles to user
        for (const roleName of userData.roles) {
          const role = await this.roleRepository.findOne({
            where: { name: roleName },
          });

          if (role) {
            const userRole = new UserRole();
            userRole.user = savedUser;
            userRole.role = role;
            await this.userRoleRepository.save(userRole);
          } else {
            console.log(
              `Role not found: ${roleName} for user ${userData.email}`,
            );
          }
        }

        console.log(
          `Created user and employee: ${userData.email} - ${userData.employee.full_name}`,
        );
        totalCreated++;
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error);
      }
    }

    return {
      message: 'Users and employees seeding completed!',
      created: totalCreated,
      skipped: totalSkipped,
      total: totalCreated + totalSkipped,
    };
  }
  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  async createEmployeeWithUser(createData: CreateEmployeeWithUserDto): Promise<{
    user: User;
    employee: Employee;
    roles: string[];
  }> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createData.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // Check if phone already exists
      const existingEmployee = await this.employeeRepository.findOne({
        where: { phone: createData.phone },
      });

      if (existingEmployee) {
        throw new BadRequestException('Phone number already exists');
      }

      // Parse date if it's a string
      let dobDate: Date;
      if (typeof createData.dob === 'string') {
        dobDate = this.parseDate(createData.dob);
      } else {
        dobDate = createData.dob;
      }

      // Create employee first
      const employee = new Employee();
      employee.full_name = createData.full_name;
      employee.phone = createData.phone;
      employee.gender = createData.gender;
      employee.address = createData.address;
      employee.dob = dobDate;
      employee.joined_date = createData.joined_date || new Date();
      //   employee.position = createData.position;
      //   employee.department = createData.department;

      const savedEmployee = await this.employeeRepository.save(employee);

      // Hash password
      const hashedPassword = await bcrypt.hash(createData.password, 12);

      // Create user with employee reference
      const user = new User();
      user.email = createData.email;
      user.password = hashedPassword;

      user.employee = savedEmployee;
      user.employee_id = savedEmployee.id;

      const savedUser = await this.userRepository.save(user);

      // Assign roles to user
      const assignedRoles: string[] = [];
      for (const roleName of createData.roles) {
        const role = await this.roleRepository.findOne({
          where: { name: roleName },
        });

        if (role) {
          const userRole = new UserRole();
          userRole.user = savedUser;
          userRole.role = role;
          await this.userRoleRepository.save(userRole);
          assignedRoles.push(roleName);
        } else {
          console.log(
            `Role not found: ${roleName} for user ${createData.email}`,
          );
        }
      }

      console.log(
        `Created user and employee: ${createData.email} - ${createData.full_name}`,
      );

      return {
        user: savedUser,
        employee: savedEmployee,
        roles: assignedRoles,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error creating user and employee:`, error);
      throw new BadRequestException('Failed to create user and employee');
    }
  }
}
