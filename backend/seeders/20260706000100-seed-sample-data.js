'use strict';

const bcrypt = require('bcrypt');

const SEEDED_PASSWORD = 'Password1234';

const managers = [
  {
    name: 'Maya Manager',
    email: 'manager@gmail.com'
  }
];

const teamMembers = [
  {
    name: 'Pethum Shyam',
    email: 'pethumshayam66@gmail.com'
  },
  {
    name: 'Akash Uvindu',
    email: 'akashuvindu@gmail.com'
  },
  {
    name: 'Hiruni Perera',
    email: 'hiruniperera@gmail.com'
  },
  {
    name: 'Kasun Silva',
    email: 'kasunsilva@gmail.com'
  },
  {
    name: 'Nethmi Fernando',
    email: 'nethmifernando@gmail.com'
  },
  {
    name: 'Dinuka Jayasinghe',
    email: 'dinukajayasinghe@gmail.com'
  },
  {
    name: 'Tharushi Wijesinghe',
    email: 'tharushiwijesinghe@gmail.com'
  },
  {
    name: 'Ravindu Perera',
    email: 'ravinduperera@gmail.com'
  },
  {
    name: 'Sahan Madushan',
    email: 'sahanmadushan@gmail.com'
  }
];

const projects = [
  {
    name: 'Internal Dashboard',
    description: 'Management dashboard, analytics, report review, and project visibility workflow.',
    isActive: true
  },
  {
    name: 'Inventory',
    description: 'Stock movement tracking, item alerts, and reporting improvements.',
    isActive: true
  },
  {
    name: 'API Stabilization',
    description: 'Backend hardening, validation improvements, and integration support.',
    isActive: true
  },
  {
    name: 'Client Portal',
    description: 'External client dashboard for progress updates and file sharing.',
    isActive: true
  },
  {
    name: 'Mobile Timesheets',
    description: 'Mobile-first time entry and weekly work summary experience.',
    isActive: true
  },
  {
    name: 'QA Automation',
    description: 'Regression test automation for weekly release confidence.',
    isActive: true
  },
  {
    name: 'Legacy CRM Migration',
    description: 'Older CRM data migration and cleanup. Kept inactive for demo filtering.',
    isActive: false
  }
];

const assignments = [
  ['Pethum Shyam', 'Internal Dashboard'],
  ['Pethum Shyam', 'API Stabilization'],
  ['Pethum Shyam', 'Legacy CRM Migration'],
  ['Akash Uvindu', 'Internal Dashboard'],
  ['Akash Uvindu', 'Inventory'],
  ['Hiruni Perera', 'Inventory'],
  ['Hiruni Perera', 'Client Portal'],
  ['Kasun Silva', 'API Stabilization'],
  ['Kasun Silva', 'QA Automation'],
  ['Nethmi Fernando', 'Client Portal'],
  ['Nethmi Fernando', 'Mobile Timesheets'],
  ['Dinuka Jayasinghe', 'Inventory'],
  ['Dinuka Jayasinghe', 'Mobile Timesheets'],
  ['Tharushi Wijesinghe', 'QA Automation'],
  ['Tharushi Wijesinghe', 'Internal Dashboard'],
  ['Ravindu Perera', 'API Stabilization'],
  ['Ravindu Perera', 'Mobile Timesheets'],
  ['Ravindu Perera', 'Legacy CRM Migration'],
  ['Sahan Madushan', 'Client Portal'],
  ['Sahan Madushan', 'QA Automation']
];

const reportTemplates = [
  {
    member: 'Pethum Shyam',
    project: 'Internal Dashboard',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Completed the manager dashboard summary polish, refined project-specific chart filtering, and verified the report review flow with long blocker text.',
    planned: 'Improve report inbox spacing, add more edge-case testing for empty dashboard states, and prepare demo screenshots.',
    blockers: null,
    hours: 38,
    notes: 'Good progress on the main demo path.',
    status: 'submitted',
    submittedAt: '2026-07-04T09:30:00Z'
  },
  {
    member: 'Pethum Shyam',
    project: 'API Stabilization',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Reviewed the authentication service and checked how refresh tokens, manager invite validation, and protected report routes work together.',
    planned: 'Finish API response consistency checks and document important backend setup notes.',
    blockers: 'Waiting for final confirmation on the staging Gemini API key before validating AI assistant responses in the demo environment.',
    hours: 12,
    notes: 'Draft kept open while final backend verification continues.',
    status: 'draft',
    submittedAt: null
  },
  {
    member: 'Akash Uvindu',
    project: 'Inventory',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Implemented stock alert UI states, improved the product search flow, and cleaned up several empty-state messages.',
    planned: 'Connect low-stock alerts to the reporting dashboard and add export support for monthly stock movement.',
    blockers: 'Need updated warehouse sample data to validate the alert thresholds with realistic item volumes.',
    hours: 34,
    notes: 'Alert thresholds are currently using mock values.',
    status: 'submitted',
    submittedAt: '2026-07-05T13:15:00Z'
  },
  {
    member: 'Akash Uvindu',
    project: 'Internal Dashboard',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Checked chart responsiveness on desktop and tablet layouts and reported minor spacing issues.',
    planned: 'Support final dashboard regression testing after the latest frontend polish is merged.',
    blockers: null,
    hours: 18,
    notes: 'Available for QA support next week.',
    status: 'submitted',
    submittedAt: '2026-07-09T08:20:00Z'
  },
  {
    member: 'Hiruni Perera',
    project: 'Client Portal',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Mapped client-facing weekly status requirements and reviewed the permission model for external viewers.',
    planned: 'Prepare wireframes for the client progress timeline and align the field names with report data.',
    blockers: null,
    hours: 28,
    notes: 'Requirements are stable enough for UI work.',
    status: 'submitted',
    submittedAt: '2026-07-04T11:45:00Z'
  },
  {
    member: 'Hiruni Perera',
    project: 'Inventory',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Reviewed item import validation and documented the main data-quality risks.',
    planned: 'Coordinate with the warehouse team to validate the import template against real stock data.',
    blockers: 'Warehouse owner is unavailable until the end of the week, so final template sign-off is delayed.',
    hours: 16,
    notes: 'Follow-up meeting is planned.',
    status: 'draft',
    submittedAt: null
  },
  {
    member: 'Kasun Silva',
    project: 'QA Automation',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Added smoke tests for login, report creation, dashboard filters, and project assignment workflows.',
    planned: 'Add tests for report submission locking and manager-only project member removal.',
    blockers: null,
    hours: 36,
    notes: 'Smoke test coverage is ready for review.',
    status: 'submitted',
    submittedAt: '2026-07-05T07:10:00Z'
  },
  {
    member: 'Kasun Silva',
    project: 'API Stabilization',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Checked duplicate assignment and duplicate report validation messages against the expected API response shape.',
    planned: 'Run integration checks after the larger seed dataset is loaded.',
    blockers: null,
    hours: 14,
    notes: 'Validation messages look consistent.',
    status: 'submitted',
    submittedAt: '2026-07-09T06:40:00Z'
  },
  {
    member: 'Nethmi Fernando',
    project: 'Mobile Timesheets',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Designed the mobile timesheet entry flow and tested the weekly summary layout on small screens.',
    planned: 'Add offline-state messaging and improve validation around hour entry.',
    blockers: 'Need final decision on whether partial-day entries should be allowed for internship tracking.',
    hours: 30,
    notes: 'Mobile layout is ready for feedback.',
    status: 'submitted',
    submittedAt: '2026-07-06T04:20:00Z'
  },
  {
    member: 'Nethmi Fernando',
    project: 'Client Portal',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Prepared reusable empty-state content for client-visible progress sections.',
    planned: 'Review access rules and connect the portal summary to backend report data.',
    blockers: null,
    hours: 10,
    notes: 'Early draft only.',
    status: 'draft',
    submittedAt: null
  },
  {
    member: 'Dinuka Jayasinghe',
    project: 'Inventory',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Fixed import preview formatting and tested item category grouping with larger data samples.',
    planned: 'Add summary counts for successful and rejected import rows.',
    blockers: null,
    hours: 33,
    notes: 'Import preview is stable.',
    status: 'submitted',
    submittedAt: '2026-07-05T15:30:00Z'
  },
  {
    member: 'Dinuka Jayasinghe',
    project: 'Mobile Timesheets',
    weekStart: '2026-07-06',
    weekEnd: '2026-07-12',
    completed: 'Reviewed timesheet navigation and wrote test notes for repeated weekly entry.',
    planned: 'Pair with Nethmi on mobile validation improvements.',
    blockers: null,
    hours: 11,
    notes: 'Testing continues this week.',
    status: 'submitted',
    submittedAt: '2026-07-09T10:10:00Z'
  },
  {
    member: 'Tharushi Wijesinghe',
    project: 'QA Automation',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Created regression checklist cases for report draft editing, submission locking, and manager report review.',
    planned: 'Convert checklist cases into automated browser tests.',
    blockers: null,
    hours: 29,
    notes: 'Checklist is shared with the team.',
    status: 'submitted',
    submittedAt: '2026-07-05T12:00:00Z'
  },
  {
    member: 'Ravindu Perera',
    project: 'API Stabilization',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Investigated slow dashboard queries and confirmed the main filters can be handled with existing indexes for the current dataset.',
    planned: 'Profile report list queries after the seed dataset grows further.',
    blockers: 'Local MySQL service was intermittently unavailable during testing, so query timing needs to be repeated.',
    hours: 24,
    notes: 'No schema changes recommended yet.',
    status: 'late',
    submittedAt: '2026-07-08T09:00:00Z'
  },
  {
    member: 'Sahan Madushan',
    project: 'Client Portal',
    weekStart: '2026-06-29',
    weekEnd: '2026-07-05',
    completed: 'Built reusable client status cards and connected the first version of project-level progress copy.',
    planned: 'Add file attachment placeholders and polish loading states.',
    blockers: null,
    hours: 31,
    notes: 'Ready for visual review.',
    status: 'submitted',
    submittedAt: '2026-07-04T16:25:00Z'
  }
];

const resetAutoIncrement = async (queryInterface, tableName) => {
  await queryInterface.sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
};

const cleanupSeedData = async (queryInterface) => {
  await queryInterface.bulkDelete('ai_query_logs', null, {});
  await queryInterface.bulkDelete('refresh_tokens', null, {});
  await queryInterface.bulkDelete('reports', null, {});
  await queryInterface.bulkDelete('user_projects', null, {});
  await queryInterface.bulkDelete('projects', null, {});
  await queryInterface.bulkDelete('users', null, {});

  await resetAutoIncrement(queryInterface, 'ai_query_logs');
  await resetAutoIncrement(queryInterface, 'refresh_tokens');
  await resetAutoIncrement(queryInterface, 'reports');
  await resetAutoIncrement(queryInterface, 'user_projects');
  await resetAutoIncrement(queryInterface, 'projects');
  await resetAutoIncrement(queryInterface, 'users');
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const passwordHash = await bcrypt.hash(SEEDED_PASSWORD, 10);

    await cleanupSeedData(queryInterface);

    await queryInterface.bulkInsert('users', [
      ...managers.map((user) => ({
        ...user,
        password_hash: passwordHash,
        role: 'manager',
        created_at: now,
        updated_at: now
      })),
      ...teamMembers.map((user) => ({
        ...user,
        password_hash: passwordHash,
        role: 'team_member',
        created_at: now,
        updated_at: now
      }))
    ]);

    const seededEmails = [...managers, ...teamMembers].map((user) => user.email);
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, name, email FROM users WHERE email IN (:emails)',
      { replacements: { emails: seededEmails } }
    );
    const userByName = new Map(users.map((user) => [user.name, user]));
    const manager = users.find((user) => user.email === managers[0].email);

    await queryInterface.bulkInsert('projects', projects.map((project) => ({
      name: project.name,
      description: project.description,
      created_by: manager.id,
      is_active: project.isActive,
      created_at: now
    })));

    const [createdProjects] = await queryInterface.sequelize.query(
      'SELECT id, name FROM projects WHERE name IN (:names)',
      { replacements: { names: projects.map((project) => project.name) } }
    );
    const projectByName = new Map(createdProjects.map((project) => [project.name, project]));

    await queryInterface.bulkInsert('user_projects', assignments.map(([memberName, projectName]) => ({
      user_id: userByName.get(memberName).id,
      project_id: projectByName.get(projectName).id,
      assigned_at: now
    })));

    await queryInterface.bulkInsert('reports', reportTemplates.map((report) => ({
      user_id: userByName.get(report.member).id,
      project_id: projectByName.get(report.project).id,
      week_start: report.weekStart,
      week_end: report.weekEnd,
      tasks_completed: report.completed,
      tasks_planned: report.planned,
      blockers: report.blockers,
      hours_worked: report.hours,
      notes: report.notes,
      status: report.status,
      submitted_at: report.submittedAt ? new Date(report.submittedAt) : null,
      created_at: now,
      updated_at: now
    })));
  },

  async down(queryInterface) {
    await cleanupSeedData(queryInterface);
  }
};
