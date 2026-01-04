const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SystemStatusService {
  constructor() {
    this.startTime = new Date();
    this.services = {
      database: { status: 'unknown', lastCheck: null },
      auth: { status: 'active', lastCheck: new Date() },
      academic: { status: 'active', lastCheck: new Date() },
      seating: { status: 'ready', lastCheck: new Date() },
      mindmap: { status: 'ready', lastCheck: new Date() },
      analytics: { status: 'active', lastCheck: new Date() },
      notifications: { status: 'active', lastCheck: new Date() },
      clubs: { status: 'active', lastCheck: new Date() },
      sos: { status: 'active', lastCheck: new Date() },
      busTracking: { status: 'active', lastCheck: new Date() }
    };
    this.stats = {
      totalRequests: 0,
      activeConnections: 0,
      errors: 0
    };
  }

  async checkDatabaseConnection() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      this.services.database = { status: 'connected', lastCheck: new Date() };
      return true;
    } catch (error) {
      this.services.database = { status: 'disconnected', lastCheck: new Date(), error: error.message };
      return false;
    }
  }

  async getSystemStats() {
    try {
      const [
        totalUsers,
        totalExams,
        totalSeatingAllocations,
        totalMindMaps,
        totalClubs,
        totalEvents,
        totalHallTickets,
        totalCourses,
        totalRoles
      ] = await Promise.all([
        prisma.user.count(),
        prisma.exam.count(),
        prisma.seatingAllocation.count(),
        prisma.mindMap.count(),
        prisma.club.count(),
        prisma.event.count(),
        prisma.hallTicket.count(),
        prisma.course.count(),
        prisma.role.count()
      ]);

      // Get role-based user counts
      const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
      const facultyRole = await prisma.role.findFirst({ where: { name: 'FACULTY' } });
      const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });

      const [totalStudents, totalFaculty, totalAdmins] = await Promise.all([
        studentRole ? prisma.userRole.count({ where: { roleId: studentRole.id } }) : 0,
        facultyRole ? prisma.userRole.count({ where: { roleId: facultyRole.id } }) : 0,
        adminRole ? prisma.userRole.count({ where: { roleId: adminRole.id } }) : 0
      ]);

      return {
        users: { 
          total: totalUsers, 
          students: totalStudents, 
          faculty: totalFaculty,
          admins: totalAdmins
        },
        exams: totalExams,
        seatingAllocations: totalSeatingAllocations,
        mindMaps: totalMindMaps,
        clubs: totalClubs,
        events: totalEvents,
        hallTickets: totalHallTickets,
        courses: totalCourses,
        roles: totalRoles
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return {
        users: { total: 0, students: 0, faculty: 0, admins: 0 },
        exams: 0,
        seatingAllocations: 0,
        mindMaps: 0,
        clubs: 0,
        events: 0,
        hallTickets: 0,
        courses: 0,
        roles: 0
      };
    }
  }

  getUptime() {
    const uptime = Date.now() - this.startTime.getTime();
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  incrementRequest() {
    this.stats.totalRequests++;
  }

  incrementError() {
    this.stats.errors++;
  }

  getHealthStatus() {
    const dbStatus = this.services.database.status === 'connected';
    const allServicesActive = Object.values(this.services).every(service => 
      service.status === 'active' || service.status === 'ready' || service.status === 'connected'
    );

    return {
      status: dbStatus && allServicesActive ? 'healthy' : 'degraded',
      uptime: this.getUptime(),
      services: this.services,
      stats: this.stats,
      timestamp: new Date().toISOString()
    };
  }

  async displayStartupBanner() {
    // Check database connection silently
    const dbConnected = await this.checkDatabaseConnection();
    
    console.log('\n🎓 UniVerse Academic System');
    console.log(`🗄️  Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
  }

  logIntelligentOperation(operation, details) {
    // Silent logging - only log to file or database if needed
    // const timestamp = new Date().toLocaleString();
    // console.log(`[${timestamp}] 🧠 ${operation}: ${details}`);
  }

  logError(operation, error) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ⚠️  ${operation} failed: ${error}`);
    this.incrementError();
  }

  logSuccess(operation, details) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ✅ ${operation}: ${details}`);
  }
}

module.exports = new SystemStatusService();