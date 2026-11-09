import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { Request } from '../models/Request.js';
import { User } from '../models/User.js';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// GET /api/admin/stats — RQF011: indicadores del panel de moderación
export function getStats(req, res) {
  const weekAgo = Date.now() - WEEK_MS;
  res.json({
    activeUsers: User.count((u) => u.role === 'user' && u.status === 'Activo'),
    publishedItems: Item.all().length,
    requestsThisWeek: Request.count((r) => r.createdAt >= weekAgo), // últimos 7 días
    activeCategories: Category.count((c) => c.status === 'Activa'),
  });
}
