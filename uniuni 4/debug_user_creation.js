#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugUserCreation() {
    try {
        console.log('🔍 Debugging User Creation...\n');
        
        // Check existing users
        const users = await prisma.user.findMany({
            take: 5,
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        
        console.log('Existing users:');
        users.forEach(user => {
            console.log(`  - ${user.id}: ${user.fullName} (${user.email})`);
            console.log(`    Roles: ${user.roles.map(r => r.role.name).join(', ')}`);
        });
        
        // Check existing roles
        const roles = await prisma.role.findMany();
        console.log('\nExisting roles:');
        roles.forEach(role => {
            console.log(`  - ${role.id}: ${role.name}`);
        });
        
        // Try to create admin user
        console.log('\n🔧 Creating admin user...');
        
        // Create ADMIN role if not exists
        const adminRole = await prisma.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: { name: 'ADMIN' }
        });
        console.log(`Admin role: ${adminRole.id} - ${adminRole.name}`);
        
        // Create admin user
        const adminUser = await prisma.user.upsert({
            where: { id: 'admin' },
            update: {},
            create: {
                id: 'admin',
                email: 'admin@university.edu',
                passwordHash: 'admin_hash',
                fullName: 'System Administrator'
            }
        });
        console.log(`Admin user: ${adminUser.id} - ${adminUser.fullName}`);
        
        // Assign role
        await prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: adminUser.id,
                    roleId: adminRole.id
                }
            },
            update: {},
            create: {
                userId: adminUser.id,
                roleId: adminRole.id
            }
        });
        console.log('Admin role assigned successfully');
        
        // Test bulk upload job creation
        console.log('\n🧪 Testing bulk upload job creation...');
        const testJob = await prisma.bulkUploadJob.create({
            data: {
                filename: 'test.csv',
                totalRows: 1,
                examSession: 'Test Session',
                uploadedBy: adminUser.id,
                status: 'PENDING'
            }
        });
        console.log(`Test job created: ${testJob.id}`);
        
        // Clean up test job
        await prisma.bulkUploadJob.delete({
            where: { id: testJob.id }
        });
        console.log('Test job cleaned up');
        
        console.log('\n✅ User creation and job creation working correctly!');
        
    } catch (error) {
        console.error('❌ Debug error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugUserCreation();