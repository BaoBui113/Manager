import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role name already exists
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role name already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['rolePermissions', 'userRoles'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Check if new name already exists (if name is being updated)
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new BadRequestException('Role name already exists');
      }
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.findOne(id);

    // Check if role is being used by users
    if (role.userRoles && role.userRoles.length > 0) {
      throw new BadRequestException(
        'Cannot delete role that is assigned to users',
      );
    }

    await this.roleRepository.remove(role);
    return { message: `Role ${role.name} has been deleted successfully` };
  }

  async seedRoles() {
    const roles = [
      // Leadership & Management
      {
        name: 'ceo',
        description:
          'Chief Executive Officer - Highest authority, oversees entire organization',
      },
      {
        name: 'cto',
        description: 'Chief Technology Officer - Head of technology department',
      },
      {
        name: 'department_head',
        description:
          'Department Head - Manages entire department operations and staff',
      },
      {
        name: 'manager',
        description:
          'Manager - Manages team within department, reports to department head',
      },
      {
        name: 'team_leader',
        description:
          'Team Leader - Leads specific team, coordinates daily activities',
      },
      {
        name: 'sub_leader',
        description: 'Sub Leader - Assists team leader, backup leadership role',
      },

      // Project Management
      {
        name: 'project_manager',
        description:
          'Project Manager - Manages projects, coordinates between teams',
      },
      {
        name: 'product_manager',
        description:
          'Product Manager - Oversees product development and strategy',
      },
      {
        name: 'scrum_master',
        description:
          'Scrum Master - Facilitates agile processes and team productivity',
      },

      // Technical Roles
      {
        name: 'senior_developer',
        description:
          'Senior Developer - Experienced developer, mentors junior staff',
      },
      {
        name: 'developer',
        description:
          'Developer - Regular development work, contributes to projects',
      },
      {
        name: 'junior_developer',
        description:
          'Junior Developer - Entry level developer, learning and contributing',
      },
      {
        name: 'tech_lead',
        description:
          'Technical Lead - Technical decision maker, architecture oversight',
      },
      {
        name: 'system_architect',
        description:
          'System Architect - Designs system architecture and technical solutions',
      },

      // Support & Operations
      {
        name: 'devops_engineer',
        description:
          'DevOps Engineer - Manages infrastructure and deployment processes',
      },
      {
        name: 'qa_engineer',
        description:
          'QA Engineer - Quality assurance, testing and bug tracking',
      },
      {
        name: 'qa_lead',
        description: 'QA Lead - Leads quality assurance team and processes',
      },
      {
        name: 'system_admin',
        description:
          'System Administrator - Manages IT infrastructure and systems',
      },

      // Business & Administration
      {
        name: 'hr_manager',
        description: 'HR Manager - Manages human resources department',
      },
      {
        name: 'hr_specialist',
        description: 'HR Specialist - Handles recruitment, employee relations',
      },
      {
        name: 'business_analyst',
        description:
          'Business Analyst - Analyzes business requirements and processes',
      },
      {
        name: 'admin',
        description:
          'Administrator - System admin with full access to manage system',
      },

      // General Staff
      {
        name: 'employee',
        description: 'Employee - Regular staff member with basic access',
      },
      {
        name: 'intern',
        description: 'Intern - Temporary staff, limited access for learning',
      },
      {
        name: 'contractor',
        description:
          'Contractor - External contractor with project-specific access',
      },
    ];

    const createdRoles: Role[] = [];

    for (const roleData of roles) {
      // Check if role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        const savedRole = await this.roleRepository.save(role);
        createdRoles.push(savedRole);
        console.log(`Created role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
        // Optionally update description
        existingRole.description = roleData.description;
        await this.roleRepository.save(existingRole);
      }
    }

    return {
      message: 'Employee management roles seeding completed!',
      created: createdRoles.length,
      total: roles.length,
      roles: createdRoles,
    };
  }
}
