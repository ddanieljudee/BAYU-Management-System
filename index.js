// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// server/data/mock-data.ts
var mockUsers = [
  {
    id: "admin-001-fixed-id",
    unimasId: "ADMIN001",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["Admin"],
    skkJobScope: null,
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "skk-001-fixed-id",
    unimasId: "SKK001",
    firstName: "SKK Highest",
    lastName: "Officer",
    email: "skk.highest@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["SKK Highest Officer"],
    skkJobScope: null,
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "skk-002-fixed-id",
    unimasId: "SKK002",
    firstName: "SKK",
    lastName: "Officer",
    email: "skk.officer@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["SKK Officer"],
    skkJobScope: "Costumes/Props",
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "fac-001-fixed-id",
    unimasId: "FAC001",
    firstName: "Faculty",
    lastName: "Officer",
    email: "faculty@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "Faculty of Computer Science and Information Technology",
    roles: ["Faculty/Division/Centre Officer"],
    skkJobScope: null,
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "staff-001-fixed-id",
    unimasId: "STAFF001",
    firstName: "John",
    lastName: "Doe",
    email: "staff@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "Faculty of Computer Science and Information Technology",
    roles: ["Staff"],
    skkJobScope: null,
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "stu-001-fixed-id",
    unimasId: "STU001",
    firstName: "Jane",
    lastName: "Smith",
    email: "student@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "Faculty of Computer Science and Information Technology",
    roles: ["Student"],
    skkJobScope: null,
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "skk-003-fixed-id",
    unimasId: "SKK003",
    firstName: "Technical",
    lastName: "Officer",
    email: "tech.skk@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["SKK Officer"],
    skkJobScope: "Technical Equipment",
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "skk-004-fixed-id",
    unimasId: "SKK004",
    firstName: "Music",
    lastName: "Officer",
    email: "music.skk@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["SKK Officer"],
    skkJobScope: "Traditional Music Instruments",
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "skk-005-fixed-id",
    unimasId: "SKK005",
    firstName: "Venue",
    lastName: "Officer",
    email: "venue.skk@unimas.my",
    password: "",
    // Will be set by storage.ts
    facultyDivisionCentre: "SKK Department",
    roles: ["SKK Officer"],
    skkJobScope: "Panggung Gemilang Booking",
    isApproved: true,
    approvedBy: null,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }
];
var mockRequests = [
  {
    id: "req-001-demo",
    requesterId: "stu-001-fixed-id",
    // Jane Smith (Student)
    category: "Costumes/Props",
    eventTitle: "Cultural Night Performance",
    description: "Need traditional costumes for 10 performers",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
    // 1 week from now
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1e3),
    // 8 days from now
    venueLocation: "Dewan Tunku Abdul Rahman",
    status: "Faculty Approved",
    assignedOfficerEmail: "skk.officer@unimas.my",
    // SKK002 - Costumes/Props officer
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
    // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)
    // 1 day ago
  },
  {
    id: "req-002-demo",
    requesterId: "staff-001-fixed-id",
    // John Doe (Staff)
    category: "Technical Equipment",
    eventTitle: "Faculty Seminar",
    description: "Need sound system and projector for seminar",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3),
    // 5 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3),
    // Same day
    venueLocation: "Lecture Hall A",
    status: "Faculty Approved",
    assignedOfficerEmail: "tech.skk@unimas.my",
    // SKK003 - Technical Equipment officer
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3),
    // 3 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
    // 2 days ago
  },
  {
    id: "req-003-demo",
    requesterId: "stu-001-fixed-id",
    // Jane Smith (Student)
    category: "Traditional Music Instruments",
    eventTitle: "Music Competition",
    description: "Need traditional instruments for competition",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3),
    // 10 days from now
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1e3),
    // 12 days from now
    venueLocation: "Music Hall",
    status: "Faculty Approved",
    assignedOfficerEmail: "music.skk@unimas.my",
    // SKK004 - Music officer
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3),
    // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)
    // 1 day ago
  },
  {
    id: "req-004-demo",
    requesterId: "staff-001-fixed-id",
    // John Doe (Staff)
    category: "Panggung Gemilang Booking",
    eventTitle: "Department Annual Dinner",
    description: "Book Panggung Gemilang for annual dinner event",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3),
    // 14 days from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3),
    // Same day
    venueLocation: "Panggung Gemilang",
    status: "Faculty Approved",
    assignedOfficerEmail: "venue.skk@unimas.my",
    // SKK005 - Venue officer
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3),
    // 4 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)
    // 3 days ago
  },
  {
    id: "req-005-demo",
    requesterId: "stu-001-fixed-id",
    // Jane Smith (Student)
    category: "Costumes/Props",
    eventTitle: "Drama Club Performance",
    description: "Props and costumes for drama performance",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1e3),
    // 20 days from now
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1e3),
    // 21 days from now
    venueLocation: "Theater Hall",
    status: "Pending",
    assignedOfficerEmail: "faculty@unimas.my",
    // Faculty officer for initial approval
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1e3),
    // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1e3)
    // 1 hour ago
  },
  {
    id: "req-006-demo",
    requesterId: "staff-001-fixed-id",
    // John Doe (Staff)
    category: "Technical Equipment",
    eventTitle: "Workshop Setup",
    description: "Audio-visual equipment for workshop",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3),
    // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3),
    // Same day
    venueLocation: "Workshop Room B",
    status: "SKK Approved",
    assignedOfficerEmail: "tech.skk@unimas.my",
    // SKK003 - Technical Equipment officer
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3),
    // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)
    // 1 day ago
  },
  {
    id: "req-007-demo",
    requesterId: "stu-001-fixed-id",
    // Jane Smith (Student)
    category: "Costumes/Props",
    eventTitle: "Theater Production",
    description: "Costumes for theater production",
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1e3),
    // 15 days from now
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1e3),
    // 16 days from now
    venueLocation: "Main Theater",
    status: "SKK Approved",
    assignedOfficerEmail: "skk.officer@unimas.my",
    // SKK002 - Costumes/Props officer
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3),
    // 6 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
    // 2 days ago
  },
  {
    id: "req-008-demo",
    requesterId: "staff-001-fixed-id",
    // John Doe (Staff)
    category: "Traditional Music Instruments",
    eventTitle: "Cultural Festival",
    description: "Traditional instruments for cultural festival",
    startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1e3),
    // 18 days from now
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1e3),
    // 19 days from now
    venueLocation: "Cultural Center",
    status: "SKK Approved",
    assignedOfficerEmail: "music.skk@unimas.my",
    // SKK004 - Music officer
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3),
    // 7 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)
    // 3 days ago
  }
];

// server/storage.ts
var MemStorage = class {
  users;
  requests;
  notifications;
  activityLogs;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.requests = /* @__PURE__ */ new Map();
    this.notifications = /* @__PURE__ */ new Map();
    this.activityLogs = /* @__PURE__ */ new Map();
    this.initializeDemoData().catch(console.error);
  }
  async initializeDemoData() {
    const hashedPassword = await bcrypt.hash("demo123", 10);
    mockUsers.forEach((user) => {
      this.users.set(user.id, { ...user, password: hashedPassword });
    });
    mockRequests.forEach((request) => {
      this.requests.set(request.id, request);
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUnimasId(unimasId) {
    return Array.from(this.users.values()).find((user) => user.unimasId === unimasId);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const isApproved = insertUser.isApproved !== void 0 ? insertUser.isApproved : this.shouldAutoApprove(insertUser.roles);
    const facultyDivisionCentre = this.shouldAutoAssignSKKDepartment(insertUser.roles) ? "SKK Department" : insertUser.facultyDivisionCentre;
    const user = {
      ...insertUser,
      id,
      facultyDivisionCentre,
      roles: insertUser.roles,
      skkJobScope: insertUser.skkJobScope || null,
      isApproved,
      approvedBy: insertUser.approvedBy || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getUsersByRole(role) {
    return Array.from(this.users.values()).filter(
      (user) => user.roles.includes(role)
    );
  }
  async getPendingUsers() {
    return Array.from(this.users.values()).filter((user) => !user.isApproved);
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async deleteUser(id) {
    const userExists = this.users.has(id);
    if (!userExists) {
      return false;
    }
    this.users.delete(id);
    Array.from(this.requests.values()).filter((request) => request.requesterId === id).forEach((request) => this.requests.delete(request.id));
    Array.from(this.notifications.values()).filter((notification) => notification.userId === id).forEach((notification) => this.notifications.delete(notification.id));
    Array.from(this.activityLogs.values()).filter((log2) => log2.userId === id).forEach((log2) => this.activityLogs.delete(log2.id));
    return true;
  }
  shouldAutoApprove(roles) {
    const autoApproveRoles = ["Student", "Staff", "Faculty/Division/Centre Officer"];
    return roles.some((role) => autoApproveRoles.includes(role));
  }
  // Helper method to determine if user should be auto-assigned to SKK Department
  shouldAutoAssignSKKDepartment(roles) {
    const skkRoles = ["Admin", "SKK Officer", "SKK Highest Officer"];
    return roles.some((role) => skkRoles.includes(role));
  }
  // Request methods
  async getRequest(id) {
    return this.requests.get(id);
  }
  async createRequest(requestData) {
    const id = randomUUID();
    const request = {
      ...requestData,
      id,
      status: "Pending",
      category: requestData.category,
      items: requestData.items || [],
      supportingDocuments: requestData.supportingDocuments || [],
      proofImages: [],
      pickupDate: null,
      returnDate: null,
      rejectionReason: null,
      approvedBy: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.requests.set(id, request);
    return request;
  }
  async updateRequest(id, updates) {
    const request = this.requests.get(id);
    if (!request) return void 0;
    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }
  async getRequests(filters) {
    let result = Array.from(this.requests.values());
    if (filters?.viewMode === "manage-requests" && filters?.userRole) {
      result = await this.filterByApprovalWorkflow(result, filters.userRole, filters.assignedOfficer);
    } else if (filters?.userId) {
      result = result.filter((request) => request.requesterId === filters.userId);
    }
    if (filters?.status) {
      result = result.filter((request) => request.status === filters.status);
    }
    if (filters?.category) {
      result = result.filter((request) => request.category === filters.category);
    }
    if (filters?.assignedOfficer && filters?.viewMode !== "manage-requests") {
      result = result.filter((request) => request.assignedOfficerEmail === filters.assignedOfficer);
    }
    const enrichedRequests = await Promise.all(
      result.map(async (request) => {
        const requester = await this.getUser(request.requesterId);
        const assignedOfficer = await this.getUserByEmail(request.assignedOfficerEmail);
        return {
          ...request,
          requesterName: requester ? `${requester.firstName} ${requester.lastName}` : "Unknown User",
          requesterEmail: requester?.email || "N/A",
          requesterFaculty: requester?.facultyDivisionCentre || "N/A",
          assignedOfficerName: assignedOfficer ? `${assignedOfficer.firstName} ${assignedOfficer.lastName}` : "N/A",
          assignedOfficerFaculty: assignedOfficer?.facultyDivisionCentre || "N/A"
        };
      })
    );
    return enrichedRequests.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  async filterByApprovalWorkflow(requests2, userRole, userEmail) {
    const filteredRequests = [];
    for (const request of requests2) {
      switch (userRole) {
        case "Faculty/Division/Centre Officer":
          if (request.status === "Pending" && request.assignedOfficerEmail === userEmail) {
            filteredRequests.push(request);
          }
          break;
        case "SKK Officer":
          if (request.status === "Faculty Approved" || request.status === "SKK Approved") {
            const officer = await this.getUserByEmail(userEmail || "");
            if (officer && officer.skkJobScope) {
              if (officer.skkJobScope === request.category) {
                filteredRequests.push(request);
              }
            } else {
            }
          }
          break;
        case "SKK Highest Officer":
          if (request.status === "SKK Approved" || request.category === "Panggung Gemilang Booking" && request.status === "Faculty Approved") {
            filteredRequests.push(request);
          }
          break;
        default:
          break;
      }
    }
    return filteredRequests;
  }
  async getRequestsByUser(userId) {
    return Array.from(this.requests.values()).filter(
      (request) => request.requesterId === userId
    );
  }
  async getRequestsByStatus(status) {
    return Array.from(this.requests.values()).filter(
      (request) => request.status === status
    );
  }
  async getRequestsByAssignedOfficer(officerEmail) {
    return Array.from(this.requests.values()).filter(
      (request) => request.assignedOfficerEmail === officerEmail
    );
  }
  async getAllRequests() {
    return Array.from(this.requests.values());
  }
  async deleteRequest(id) {
    return this.requests.delete(id);
  }
  // Notification methods
  async getNotification(id) {
    return this.notifications.get(id);
  }
  async createNotification(insertNotification) {
    const id = randomUUID();
    const notification = {
      ...insertNotification,
      id,
      isRead: false,
      relatedRequestId: insertNotification.relatedRequestId || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }
  async updateNotification(id, updates) {
    const notification = this.notifications.get(id);
    if (!notification) return void 0;
    const updatedNotification = {
      ...notification,
      ...updates
    };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  async getNotificationsByUser(userId) {
    return Array.from(this.notifications.values()).filter((notification) => notification.userId === userId).sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt ? b.createdAt.getTime() : 0;
      return bTime - aTime;
    });
  }
  async markNotificationAsRead(id) {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
  // Activity log methods
  async createActivityLog(insertLog) {
    const id = randomUUID();
    const log2 = {
      ...insertLog,
      id,
      targetId: insertLog.targetId || null,
      details: insertLog.details || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.activityLogs.set(id, log2);
    return log2;
  }
  async getActivityLogsByUser(userId) {
    return Array.from(this.activityLogs.values()).filter((log2) => log2.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getAllActivityLogs() {
    return Array.from(this.activityLogs.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  // Panggung Gemilang availability checking
  async checkPanggungGemilangAvailability(startDate, endDate, excludeRequestId) {
    const approvedPanggungRequests = Array.from(this.requests.values()).filter(
      (request) => request.category === "Panggung Gemilang Booking" && request.status === "Done" && // Only final approved status counts as booked
      (excludeRequestId ? request.id !== excludeRequestId : true)
    );
    const conflictingRequests = approvedPanggungRequests.filter((request) => {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      return startDate <= requestEnd && requestStart <= endDate;
    });
    return {
      available: conflictingRequests.length === 0,
      conflictingRequests
    };
  }
  // Auto-reject competing Panggung Gemilang requests when one gets final approval
  async autoRejectCompetingPanggungRequests(approvedRequestId) {
    const approvedRequest = this.requests.get(approvedRequestId);
    if (!approvedRequest || approvedRequest.category !== "Panggung Gemilang Booking") {
      return;
    }
    const competingRequests = Array.from(this.requests.values()).filter(
      (request) => request.id !== approvedRequestId && request.category === "Panggung Gemilang Booking" && (request.status === "Pending" || request.status === "Faculty Approved" || request.status === "SKK Approved")
    );
    for (const request of competingRequests) {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      const approvedStart = new Date(approvedRequest.startDate);
      const approvedEnd = new Date(approvedRequest.endDate);
      if (approvedStart <= requestEnd && requestStart <= approvedEnd) {
        await this.updateRequest(request.id, {
          status: "Rejected",
          rejectionReason: "Panggung Gemilang is already booked by another approved event and is unavailable."
        });
        await this.createNotification({
          userId: request.requesterId,
          title: "Request Auto-Rejected",
          message: `Your Panggung Gemilang booking for "${request.eventTitle}" has been automatically rejected due to a scheduling conflict with another approved event.`,
          type: "rejection",
          relatedRequestId: request.id
        });
      }
    }
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unimasId: text("unimas_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  facultyDivisionCentre: text("faculty_division_centre").notNull(),
  roles: jsonb("roles").$type().notNull(),
  skkJobScope: text("skk_job_scope").$type(),
  isApproved: boolean("is_approved").default(false),
  approvedBy: varchar("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull(),
  category: text("category").$type().notNull(),
  eventTitle: text("event_title").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  venueLocation: text("venue_location").notNull(),
  assignedOfficerEmail: text("assigned_officer_email").notNull(),
  description: text("description").notNull(),
  items: jsonb("items").$type().default([]),
  status: text("status").$type().default("Pending"),
  supportingDocuments: jsonb("supporting_documents").$type().default([]),
  proofImages: jsonb("proof_images").$type().default([]),
  pickupDate: timestamp("pickup_date"),
  returnDate: timestamp("return_date"),
  rejectionReason: text("rejection_reason"),
  approvedBy: varchar("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  // 'request', 'approval', 'rejection', 'system'
  isRead: boolean("is_read").default(false),
  relatedRequestId: varchar("related_request_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  // 'request', 'user', 'system'
  targetId: varchar("target_id"),
  details: jsonb("details").$type(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  unimasId: true,
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  facultyDivisionCentre: true,
  roles: true,
  skkJobScope: true
});
var insertRequestSchema = createInsertSchema(requests).pick({
  requesterId: true,
  category: true,
  eventTitle: true,
  startDate: true,
  endDate: true,
  assignedOfficerEmail: true,
  description: true,
  items: true,
  supportingDocuments: true
}).extend({
  venueLocation: z.string().min(1, "Venue location is required")
});
var insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  relatedRequestId: true
});
var insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  targetType: true,
  targetId: true,
  details: true
});

// server/routes.ts
import bcrypt2 from "bcrypt";
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}
async function registerRoutes(app2) {
  app2.use((req, res, next) => {
    if (req.body && typeof req.body === "object") {
      sanitizeObject(req.body);
    }
    next();
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const allowedRoles = ["Student", "Staff", "Faculty/Division/Centre Officer"];
      const hasOnlyAllowedRoles = userData.roles.every((role) => allowedRoles.includes(role));
      if (!hasOnlyAllowedRoles) {
        return res.status(400).json({
          message: "Invalid role selection. Only Student, Staff, and Faculty roles are allowed for public registration."
        });
      }
      const existingUser = await storage.getUserByUnimasId(userData.unimasId);
      if (existingUser) {
        return res.status(400).json({ message: "User with this UNIMAS ID already exists" });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const hashedPassword = await bcrypt2.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      await storage.createActivityLog({
        userId: user.id,
        action: "User registered",
        targetType: "user",
        targetId: user.id,
        details: { roles: user.roles }
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/admin/register", async (req, res) => {
    try {
      const session2 = req.session;
      if (!session2?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const adminUser = await storage.getUser(session2.userId);
      if (!adminUser || !adminUser.roles.some((role) => ["Admin", "SKK Highest Officer"].includes(role))) {
        return res.status(403).json({ message: "Admin or SKK Highest Officer privileges required" });
      }
      const userData = insertUserSchema.parse(req.body);
      let allowedRoles;
      if (adminUser.roles.includes("Admin")) {
        allowedRoles = ["SKK Officer", "SKK Highest Officer", "Admin"];
      } else if (adminUser.roles.includes("SKK Highest Officer")) {
        allowedRoles = ["SKK Officer", "SKK Highest Officer"];
      } else {
        return res.status(403).json({ message: "Insufficient privileges" });
      }
      const hasOnlyAllowedRoles = userData.roles.every((role) => allowedRoles.includes(role));
      if (!hasOnlyAllowedRoles) {
        return res.status(400).json({
          message: "Invalid role selection. You can only create roles within your authority."
        });
      }
      const existingUser = await storage.getUserByUnimasId(userData.unimasId);
      if (existingUser) {
        return res.status(400).json({ message: "User with this UNIMAS ID already exists" });
      }
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const hashedPassword = await bcrypt2.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        isApproved: true,
        approvedBy: adminUser.id
      });
      await storage.createActivityLog({
        userId: adminUser.id,
        action: "Official account created",
        targetType: "user",
        targetId: user.id,
        details: { roles: user.roles, createdFor: `${user.firstName} ${user.lastName}` }
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Admin registration error:", error);
      res.status(400).json({ message: "Registration failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { unimasId, password } = req.body;
      const user = await storage.getUserByUnimasId(unimasId);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isApproved) {
        return res.status(403).json({ message: "Account pending approval" });
      }
      const isValidPassword = await bcrypt2.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const session2 = req.session;
      session2.userId = user.id;
      await storage.createActivityLog({
        userId: user.id,
        action: "User logged in",
        targetType: "user",
        targetId: user.id,
        details: {}
      });
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      const session2 = req.session;
      if (session2?.userId) {
        await storage.createActivityLog({
          userId: session2.userId,
          action: "User logged out",
          targetType: "user",
          targetId: session2.userId,
          details: {}
        });
        session2.destroy((err) => {
          if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).json({ message: "Logout failed" });
          }
          res.json({ message: "Logged out successfully" });
        });
      } else {
        res.json({ message: "Already logged out" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      const session2 = req.session;
      if (!session2?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUser(session2.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPasswords = users2.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/pending", async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      const usersWithoutPasswords = pendingUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/users/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;
      const updatedUser = await storage.updateUser(id, {
        isApproved: true,
        approvedBy
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createNotification({
        userId: id,
        title: "Account Approved",
        message: "Your account has been approved and you can now access the system.",
        type: "system"
      });
      await storage.createActivityLog({
        userId: approvedBy,
        action: "User approved",
        targetType: "user",
        targetId: id,
        details: { roles: updatedUser.roles }
      });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/users/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const { rejectedBy, reason } = req.body;
      await storage.createNotification({
        userId: id,
        title: "Account Rejected",
        message: `Your account registration has been rejected. Reason: ${reason}`,
        type: "system"
      });
      await storage.createActivityLog({
        userId: rejectedBy,
        action: "User rejected",
        targetType: "user",
        targetId: id,
        details: { reason }
      });
      res.json({ message: "User rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const session2 = req.session;
      if (!session2?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const currentUser = await storage.getUser(session2.userId);
      if (!currentUser || !currentUser.roles.some((role) => ["Admin", "SKK Highest Officer"].includes(role))) {
        return res.status(403).json({ message: "Admin or SKK Highest Officer privileges required" });
      }
      const { id } = req.params;
      const updateData = req.body;
      if (updateData.password || updateData.unimasId) {
        return res.status(400).json({ message: "Password and UNIMAS ID cannot be changed through this endpoint" });
      }
      if (updateData.roles?.includes("SKK Officer") && !updateData.skkJobScope) {
        return res.status(400).json({ message: "SKK Officers must have a specialized job scope" });
      }
      const updatedUser = await storage.updateUser(id, {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        facultyDivisionCentre: updateData.facultyDivisionCentre,
        roles: updateData.roles,
        skkJobScope: updateData.skkJobScope
      });
      await storage.createActivityLog({
        userId: currentUser.id,
        action: "User details updated",
        targetType: "user",
        targetId: id,
        details: {
          updatedFields: Object.keys(updateData),
          updatedBy: `${currentUser.firstName} ${currentUser.lastName}`
        }
      });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.patch("/api/users/:id/profile", async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, facultyDivisionCentre } = req.body;
      const user = await storage.getUser(id);
      if (!user) {
        const session2 = req.session;
        session2.destroy((err) => {
          if (err) console.error("Session destruction error:", err);
        });
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      if (email !== user.email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail && existingEmail.id !== id) {
          return res.status(400).json({ message: "Email already taken" });
        }
      }
      const updatedUser = await storage.updateUser(id, {
        firstName,
        lastName,
        email,
        facultyDivisionCentre
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createActivityLog({
        userId: id,
        action: "Profile updated",
        targetType: "user",
        targetId: id,
        details: { changes: { firstName, lastName, email, facultyDivisionCentre } }
      });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/users/:id/password", async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isValidPassword = await bcrypt2.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt2.hash(newPassword, 10);
      await storage.updateUser(id, {
        password: hashedPassword
      });
      await storage.createActivityLog({
        userId: id,
        action: "Password changed",
        targetType: "user",
        targetId: id,
        details: {}
      });
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      const session2 = req.session;
      if (!session2?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const currentUser = await storage.getUser(session2.userId);
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" });
      }
      const isAdmin = currentUser.roles.includes("Admin");
      const isSKKHighestOfficer = currentUser.roles.includes("SKK Highest Officer");
      if (!isAdmin && !isSKKHighestOfficer) {
        return res.status(403).json({ message: "Admin or SKK Highest Officer privileges required to delete users" });
      }
      const { id } = req.params;
      const userToDelete = await storage.getUser(id);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
      if (id === currentUser.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      if (isSKKHighestOfficer && !isAdmin) {
        const allowedRoles = ["SKK Officer", "SKK Highest Officer"];
        const hasAllowedRole = userToDelete.roles.some((role) => allowedRoles.includes(role));
        if (!hasAllowedRole) {
          return res.status(403).json({
            message: "SKK Highest Officers can only delete users with SKK Officer or SKK Highest Officer roles"
          });
        }
      }
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createActivityLog({
        userId: currentUser.id,
        action: "User deleted",
        targetType: "user",
        targetId: id,
        details: {
          deletedUser: `${userToDelete.firstName} ${userToDelete.lastName}`,
          roles: userToDelete.roles,
          deletedBy: `${currentUser.firstName} ${currentUser.lastName}`
        }
      });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.post("/api/requests", async (req, res) => {
    try {
      const { startDate, endDate, requesterId, ...otherData } = req.body;
      const facultyOfficers = await storage.getUsersByRole("Faculty/Division/Centre Officer");
      const assignedOfficer = facultyOfficers[0];
      let assignedOfficerEmail = "faculty@unimas.my";
      if (assignedOfficer) {
        assignedOfficerEmail = assignedOfficer.email;
      }
      const requestData = insertRequestSchema.parse({
        ...otherData,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        assignedOfficerEmail,
        requesterId,
        venueLocation: otherData.venueLocation || "TBD"
      });
      if (requestData.category === "Panggung Gemilang Booking") {
        const availabilityCheck = await storage.checkPanggungGemilangAvailability(
          new Date(startDate),
          new Date(endDate)
        );
        if (!availabilityCheck.available) {
          const conflictDetails = availabilityCheck.conflictingRequests.map((req2) => ({
            eventTitle: req2.eventTitle,
            startDate: req2.startDate,
            endDate: req2.endDate,
            status: req2.status
          }));
          return res.status(409).json({
            message: "Panggung Gemilang is already booked for the selected dates",
            conflictingRequests: conflictDetails
          });
        }
      }
      const request = await storage.createRequest(requestData);
      const notificationOfficer = await storage.getUserByEmail(request.assignedOfficerEmail);
      if (notificationOfficer) {
        await storage.createNotification({
          userId: notificationOfficer.id,
          title: "New Request Assigned",
          message: `A new ${request.category} request has been assigned to you for ${request.eventTitle}.`,
          type: "request",
          relatedRequestId: request.id
        });
      }
      await storage.createActivityLog({
        userId: requestData.requesterId,
        action: "Request created",
        targetType: "request",
        targetId: request.id,
        details: { category: request.category, eventTitle: request.eventTitle }
      });
      res.status(201).json(request);
    } catch (error) {
      console.error("Request creation error:", error);
      res.status(400).json({ message: "Invalid request data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.post("/api/requests/check-availability", async (req, res) => {
    try {
      const { startDate, endDate, excludeRequestId } = req.body;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const availabilityCheck = await storage.checkPanggungGemilangAvailability(
        new Date(startDate),
        new Date(endDate),
        excludeRequestId
      );
      res.json(availabilityCheck);
    } catch (error) {
      console.error("Availability check error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/requests", async (req, res) => {
    try {
      const { userId, status, category, assignedOfficer, viewMode, userRole } = req.query;
      const requests2 = await storage.getRequests({
        userId,
        status,
        category,
        assignedOfficer,
        viewMode,
        userRole
      });
      res.json(requests2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/requests/:id", async (req, res) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/requests/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { approvedBy, approverRole, pickupDate, returnDate } = req.body;
      const request = await storage.getRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      let newStatus = request.status;
      let nextApprover = "";
      if (approverRole === "Faculty/Division/Centre Officer" && request.status === "Pending") {
        newStatus = "Faculty Approved";
        nextApprover = "SKK Officer";
      } else if (approverRole === "SKK Officer" && request.status === "Faculty Approved") {
        newStatus = "SKK Approved";
        nextApprover = "SKK Highest Officer";
      } else if (approverRole === "SKK Highest Officer" && request.status === "SKK Approved") {
        newStatus = "Done";
        nextApprover = "";
        if (request.category === "Panggung Gemilang Booking") {
          await storage.autoRejectCompetingPanggungRequests(id);
        }
      }
      const updatedRequest = await storage.updateRequest(id, {
        status: newStatus,
        approvedBy,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        returnDate: returnDate ? new Date(returnDate) : null
      });
      await storage.createNotification({
        userId: request.requesterId,
        title: "Request Approved",
        message: `Your request "${request.eventTitle}" has been approved by ${approverRole}${nextApprover ? ` and forwarded to ${nextApprover}` : ""}`,
        type: "approval",
        relatedRequestId: id
      });
      await storage.createActivityLog({
        userId: approvedBy,
        action: `Request approved by ${approverRole}`,
        targetType: "request",
        targetId: id,
        details: { requestTitle: request.eventTitle, newStatus }
      });
      if (newStatus === "Done") {
        await storage.createActivityLog({
          userId: request.requesterId,
          action: "Request completed successfully",
          targetType: "request",
          targetId: id,
          details: {
            category: request.category,
            eventTitle: request.eventTitle,
            completedByRole: approverRole
          }
        });
      }
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/requests/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const { rejectedBy, reason } = req.body;
      const request = await storage.getRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      const updatedRequest = await storage.updateRequest(id, {
        status: "Rejected",
        rejectionReason: reason
      });
      await storage.createNotification({
        userId: request.requesterId,
        title: "Request Rejected",
        message: `Your request for ${request.eventTitle} has been rejected. Reason: ${reason}`,
        type: "rejection",
        relatedRequestId: id
      });
      await storage.createActivityLog({
        userId: rejectedBy,
        action: "Request rejected",
        targetType: "request",
        targetId: id,
        details: { eventTitle: request.eventTitle, reason }
      });
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/requests/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const { completedBy, proofImages } = req.body;
      const request = await storage.getRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      const updatedRequest = await storage.updateRequest(id, {
        status: "Done",
        proofImages: proofImages || []
      });
      await storage.createNotification({
        userId: request.requesterId,
        title: "Request Completed",
        message: `Your request for ${request.eventTitle} has been marked as completed.`,
        type: "system",
        relatedRequestId: id
      });
      await storage.createActivityLog({
        userId: completedBy,
        action: "Request completed",
        targetType: "request",
        targetId: id,
        details: { eventTitle: request.eventTitle }
      });
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.put("/api/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const existingRequest = await storage.getRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (existingRequest.status !== "Pending") {
        return res.status(400).json({ message: "Cannot edit request that has been processed" });
      }
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }
      const updatedRequest = await storage.updateRequest(id, {
        ...updateData,
        updatedAt: /* @__PURE__ */ new Date()
      });
      await storage.createActivityLog({
        userId: existingRequest.requesterId,
        action: "Request updated",
        targetType: "request",
        targetId: id,
        details: {
          category: updatedRequest.category,
          eventTitle: updatedRequest.eventTitle,
          changes: Object.keys(updateData)
        }
      });
      res.json(updatedRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.delete("/api/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { deletedBy } = req.body;
      const existingRequest = await storage.getRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (existingRequest.status !== "Pending") {
        return res.status(400).json({ message: "Cannot delete request that has been processed" });
      }
      const deleted = await storage.deleteRequest(id);
      if (!deleted) {
        return res.status(404).json({ message: "Request not found" });
      }
      await storage.createActivityLog({
        userId: deletedBy || existingRequest.requesterId,
        action: "Request deleted",
        targetType: "request",
        targetId: id,
        details: {
          category: existingRequest.category,
          eventTitle: existingRequest.eventTitle
        }
      });
      res.json({ message: "Request deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications2 = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const success = await storage.markNotificationAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/activity-logs/:userId", async (req, res) => {
    try {
      const logs = await storage.getActivityLogsByUser(req.params.userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/activity-logs", async (req, res) => {
    try {
      const logs = await storage.getAllActivityLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      errorId
    });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "skk-request-management-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
/**
 * BAYU Web Application - Mock Data
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 * 
 * Demo users and requests for testing and demonstration purposes.
 * All demo accounts use the password: "demo123"
 */
/**
 * BAYU Web Application - Data Storage Layer
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 * 
 * In-memory storage implementation with business logic for BAYU application
 */
/**
 * BAYU Web Application - Shared Schema Definitions
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 * 
 * TypeScript types and Zod schemas for BAYU application
 */
/**
 * BAYU Web Application - API Routes
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 * 
 * RESTful API endpoints for BAYU application
 */
/**
 * BAYU Web Application - Vite Configuration
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 */
/**
 * BAYU Web Application - Server Entry Point
 * 
 * @author Daniel
 * @copyright © 2025 Daniel. All rights reserved.
 * @license MIT
 * 
 * BAYU (Booking and Approval for UNIMAS Youth)
 * A comprehensive web application for managing cultural event requests and resource bookings
 */
