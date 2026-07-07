'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Pass661122', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Pethum Manager',
        email: 'pethumshayam66@gmail.com',
        password_hash: passwordHash,
        role: 'manager',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Akash TeamMember',
        email: 'akashuvindu@gmail.com',
        password_hash: passwordHash,
        role: 'team_member',
        created_at: now,
        updated_at: now
      }
    ]);

    const [users] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email IN ('pethumshayam66@gmail.com', 'akashuvindu@gmail.com')"
    );
    const manager = users.find((user) => user.email === 'pethumshayam66@gmail.com');
    const member = users.find((user) => user.email === 'akashuvindu@gmail.com');

    await queryInterface.bulkInsert('projects', [
      {
        name: 'Internal Dashboard',
        description: 'Management dashboard and reporting workflow.',
        created_by: manager.id,
        is_active: true,
        created_at: now
      },
      {
        name: 'API Stabilization',
        description: 'Backend hardening and integration support.',
        created_by: manager.id,
        is_active: true,
        created_at: now
      }
    ]);

    const [projects] = await queryInterface.sequelize.query(
      "SELECT id, name FROM projects WHERE name IN ('Internal Dashboard', 'API Stabilization')"
    );
    const dashboard = projects.find((project) => project.name === 'Internal Dashboard');
    const api = projects.find((project) => project.name === 'API Stabilization');

    await queryInterface.bulkInsert('user_projects', [
      {
        user_id: member.id,
        project_id: dashboard.id,
        assigned_at: now
      },
      {
        user_id: member.id,
        project_id: api.id,
        assigned_at: now
      }
    ]);

    await queryInterface.bulkInsert('reports', [
      {
        user_id: member.id,
        project_id: dashboard.id,
        week_start: '2026-06-29',
        week_end: '2026-07-05',
        tasks_completed: 'Built dashboard summary endpoint and added report filters.',
        tasks_planned: 'Add chart endpoints and improve pagination metadata.',
        blockers: null,
        hours_worked: 32,
        notes: 'Ready for manager review.',
        status: 'submitted',
        submitted_at: new Date('2026-07-04T10:00:00Z'),
        created_at: now,
        updated_at: now
      },
      {
        user_id: member.id,
        project_id: api.id,
        week_start: '2026-06-29',
        week_end: '2026-07-05',
        tasks_completed: 'Reviewed auth middleware and refresh-token storage.',
        tasks_planned: 'Finish AI chat logging and add more request validation.',
        blockers: 'Waiting for Gemini API key in staging.',
        hours_worked: 8,
        notes: 'Security review pending.',
        status: 'draft',
        submitted_at: null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reports', null, {});
    await queryInterface.bulkDelete('user_projects', null, {});
    await queryInterface.bulkDelete('projects', {
      name: ['Internal Dashboard', 'API Stabilization']
    }, {});
    await queryInterface.bulkDelete('users', {
      email: ['pethumshayam66@gmail.com', 'akashuvindu@gmail.com']
    }, {});
  }
};
