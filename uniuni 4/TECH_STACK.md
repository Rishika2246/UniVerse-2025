# UniVerse Academic Management System - Tech Stack

## 📋 Overview

UniVerse is a comprehensive academic management platform built with modern web technologies, featuring a microservices architecture with separate frontend and backend applications, advanced database modeling, and AI-powered features.

---

## 🏗️ Architecture

### **System Architecture**
- **Pattern**: Full-Stack Web Application with RESTful API
- **Deployment**: Monorepo with separate frontend/backend services
- **Communication**: HTTP/HTTPS REST APIs with JSON payloads
- **Authentication**: JWT-based stateless authentication
- **File Storage**: Local file system with configurable paths

---

## 🎯 Frontend Stack

### **Core Framework**
- **React 18.3.1** - Modern React with Hooks and Concurrent Features
- **TypeScript** - Type-safe JavaScript development
- **Vite 6.3.5** - Fast build tool and development server
- **SWC** - Super-fast TypeScript/JavaScript compiler

### **UI Framework & Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Comprehensive component library
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog
  - Dropdown Menu, Navigation Menu, Popover, Select
  - Slider, Switch, Tabs, Tooltip, and more
- **Lucide React 0.487.0** - Beautiful icon library
- **Motion** - Animation library for smooth interactions
- **Class Variance Authority** - Component variant management

### **Data Visualization & Charts**
- **Recharts 2.15.2** - Composable charting library
- **React Flow** - Interactive node-based diagrams
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 4.2.1** - React bindings for Leaflet

### **Form Management & Validation**
- **React Hook Form 7.55.0** - Performant forms with easy validation
- **React Day Picker 8.10.1** - Date picker component
- **Input OTP 1.4.2** - One-time password input

### **UI Enhancement Libraries**
- **Embla Carousel React 8.6.0** - Touch-friendly carousel
- **React Resizable Panels 2.1.7** - Resizable layout panels
- **Sonner 2.0.3** - Toast notifications
- **Vaul 1.1.2** - Drawer component
- **CMDK 1.1.1** - Command palette interface
- **Next Themes 0.4.6** - Theme management

### **Utility Libraries**
- **clsx** - Conditional className utility
- **Tailwind Merge** - Tailwind class merging
- **HTML to Image** - Convert DOM to images
- **HTML2Canvas** - Screenshot generation
- **QRCode** - QR code generation
- **PDF.js** - PDF rendering and manipulation

### **Development Tools**
- **@types/node** - Node.js type definitions
- **@types/leaflet** - Leaflet type definitions
- **@vitejs/plugin-react-swc** - Vite React plugin with SWC

---

## ⚙️ Backend Stack

### **Runtime & Framework**
- **Node.js 16+** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **Morgan 1.10.1** - HTTP request logger middleware

### **Database & ORM**
- **PostgreSQL** - Primary relational database
- **Prisma 5.22.0** - Next-generation ORM
  - Type-safe database client
  - Database migrations
  - Schema management
  - Prisma Studio for database GUI

### **Authentication & Security**
- **JSON Web Tokens (JWT) 9.0.2** - Stateless authentication
- **bcryptjs 2.4.3** - Password hashing
- **Express Validator 7.0.1** - Input validation and sanitization
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Cookie Parser 1.4.7** - Cookie parsing middleware

### **File Processing & Generation**
- **Multer 1.4.5** - File upload handling
- **PDFKit 0.17.2** - PDF generation
- **QRCode 1.5.4** - QR code generation
- **UUID 9.0.1** - Unique identifier generation

### **Data Processing**
- **CSV Parse 6.1.0** - CSV file parsing
- **Node Fetch 2.7.0** - HTTP client for API calls

### **Email & Communication**
- **Nodemailer 6.9.5** - Email sending capability

### **Task Scheduling**
- **Node Cron 3.0.2** - Scheduled task execution

### **API Documentation**
- **Swagger JSDoc 6.2.8** - API documentation generation
- **Swagger UI Express 5.0.0** - Interactive API documentation

### **Template Engine**
- **EJS 3.1.10** - Embedded JavaScript templates

### **Development Tools**
- **Nodemon 3.0.1** - Development server with auto-restart
- **ESLint 8.54.0** - Code linting
- **Prettier 3.1.0** - Code formatting
- **dotenv 16.3.1** - Environment variable management

---

## 🗄️ Database Architecture

### **Database System**
- **PostgreSQL** - Primary database with ACID compliance
- **Prisma Schema** - Comprehensive data modeling

### **Key Data Models**
- **User Management**: Users, Roles, UserRoles
- **Academic System**: Courses, Exams, Syllabus, StudentCourses
- **Certificate Vault**: Certificates, CertificateFolders, CertificateTags
- **Seating Management**: Rooms, Seats, SeatingAllocations, HallTickets
- **Club Management**: Clubs, Events, EventDocuments, EventAttendees
- **Communication**: ChatMessages, ChatAttachments, ChatReactions
- **Security**: QrScans, FraudAttempts, SystemAlerts
- **AI & Analytics**: AiDecisions, Notifications, SystemConfig
- **Performance Tracking**: Students, Grades, Attendance
- **Budget Management**: Budgets, BudgetExpenses
- **Bulk Operations**: BulkUploadJobs, BulkUploadLogs

### **Advanced Features**
- **UUID Primary Keys** - Globally unique identifiers
- **Soft Deletes** - Data preservation with status flags
- **Audit Trails** - Created/updated timestamps
- **Relationship Integrity** - Foreign key constraints
- **Indexing Strategy** - Optimized query performance
- **JSON Fields** - Flexible metadata storage

---

## 🔧 Development & Build Tools

### **Package Management**
- **npm** - Node.js package manager
- **Monorepo Structure** - Organized codebase with shared dependencies

### **Build & Bundling**
- **Vite** - Fast build tool with HMR
- **SWC** - Rust-based JavaScript/TypeScript compiler
- **ESBuild** - Fast JavaScript bundler (via Vite)

### **Code Quality**
- **TypeScript** - Static type checking
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Husky** (implied) - Git hooks for quality gates

### **Development Workflow**
- **Hot Module Replacement** - Instant development feedback
- **Source Maps** - Debugging support
- **Environment Variables** - Configuration management
- **CORS Configuration** - Cross-origin development support

---

## 🚀 Deployment & Infrastructure

### **Server Configuration**
- **Port Configuration**: Backend (3001), Frontend (3002/3003)
- **Environment Management**: Development, Production modes
- **Process Management**: Node.js process handling

### **Database Management**
- **Migrations**: Prisma-managed schema evolution
- **Seeding**: Automated test data generation
- **Connection Pooling**: PostgreSQL connection management

### **File Management**
- **Upload Handling**: Multer-based file processing
- **Static Assets**: Express static file serving
- **PDF Generation**: Server-side document creation

---

## 🤖 AI & Advanced Features

### **AI Integration**
- **Content Processing**: Intelligent text analysis
- **Decision Tracking**: AI decision logging and override capability
- **Smart Recommendations**: Context-aware suggestions

### **Security Features**
- **QR Code Security**: Token-based verification with signatures
- **Fraud Detection**: Automated suspicious activity monitoring
- **Audit Logging**: Comprehensive action tracking
- **Rate Limiting**: API protection mechanisms

### **Real-time Features**
- **Live Updates**: Dynamic content refresh
- **Notification System**: Multi-channel alert delivery
- **Status Tracking**: Real-time process monitoring

---

## 📊 Performance & Scalability

### **Frontend Optimization**
- **Code Splitting**: Lazy loading with React.lazy
- **Bundle Optimization**: Vite's optimized bundling
- **Asset Optimization**: Image and resource compression
- **Caching Strategy**: Browser caching headers

### **Backend Optimization**
- **Database Indexing**: Strategic index placement
- **Query Optimization**: Prisma query optimization
- **Connection Pooling**: Efficient database connections
- **Middleware Optimization**: Streamlined request processing

### **Monitoring & Analytics**
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Usage Analytics**: Feature usage tracking
- **System Health**: Automated health checks

---

## 🔐 Security Implementation

### **Authentication & Authorization**
- **JWT Tokens**: Stateless authentication
- **Role-Based Access Control**: Granular permissions
- **Password Security**: bcrypt hashing
- **Session Management**: Secure token handling

### **Data Protection**
- **Input Validation**: Express-validator sanitization
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Cross-site request forgery prevention

### **File Security**
- **Upload Validation**: File type and size restrictions
- **Virus Scanning**: File content validation
- **Secure Storage**: Protected file access
- **Hash Verification**: File integrity checking

---

## 📱 Mobile & Responsive Design

### **Responsive Framework**
- **Tailwind CSS**: Mobile-first responsive design
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch Interactions**: Mobile-optimized UI components
- **Progressive Enhancement**: Graceful degradation

### **Cross-Platform Compatibility**
- **Browser Support**: Modern browser compatibility
- **Device Adaptation**: Responsive breakpoints
- **Performance Optimization**: Mobile-specific optimizations

---

## 🔄 Integration & APIs

### **External Integrations**
- **Email Services**: SMTP integration via Nodemailer
- **File Processing**: PDF and image manipulation
- **QR Code Services**: Generation and validation
- **Map Services**: Leaflet-based mapping

### **API Architecture**
- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Communication**: Structured data exchange
- **Error Handling**: Consistent error responses
- **Documentation**: Swagger/OpenAPI specification

---

## 📈 Monitoring & Maintenance

### **Logging & Debugging**
- **Morgan Logging**: HTTP request logging
- **Error Tracking**: Comprehensive error capture
- **Debug Information**: Development debugging tools
- **Performance Monitoring**: Response time tracking

### **Maintenance Tools**
- **Database Migrations**: Schema version control
- **Backup Strategies**: Data protection mechanisms
- **Health Checks**: System status monitoring
- **Update Management**: Dependency management

---

## 🎯 Key Strengths

1. **Modern Tech Stack**: Latest versions of proven technologies
2. **Type Safety**: Full TypeScript implementation
3. **Scalable Architecture**: Modular, maintainable codebase
4. **Security First**: Comprehensive security measures
5. **Developer Experience**: Excellent tooling and development workflow
6. **Performance Optimized**: Fast build times and runtime performance
7. **Comprehensive Features**: Full-featured academic management system
8. **AI Integration**: Smart features with decision tracking
9. **Mobile Ready**: Responsive design for all devices
10. **Production Ready**: Robust error handling and monitoring

---

## 📋 Version Information

- **Node.js**: 16.0.0+
- **React**: 18.3.1
- **TypeScript**: Latest
- **Prisma**: 5.22.0
- **PostgreSQL**: Latest stable
- **Vite**: 6.3.5

---

*This tech stack represents a modern, scalable, and maintainable academic management system built with industry best practices and cutting-edge technologies.*