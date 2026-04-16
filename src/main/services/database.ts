import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { Generation } from '../types'

let db: Database.Database | null = null

export function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'motionclone.db')
  db = new Database(dbPath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id TEXT PRIMARY KEY,
      input_image_path TEXT NOT NULL,
      input_video_path TEXT NOT NULL,
      output_video_path TEXT,
      status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
      quality TEXT NOT NULL,
      model TEXT NOT NULL DEFAULT 'mimic-motion',
      error_message TEXT,
      duration_ms INTEGER,
      created_at INTEGER NOT NULL,
      completed_at INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
  `)

  return db
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export function createGeneration(data: Omit<Generation, 'created_at'>): Generation {
  const database = getDatabase()
  const stmt = database.prepare(`
    INSERT INTO generations (id, input_image_path, input_video_path, output_video_path, status, quality, model, error_message, duration_ms, created_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const created_at = Date.now()
  stmt.run(
    data.id,
    data.input_image_path,
    data.input_video_path,
    data.output_video_path,
    data.status,
    data.quality,
    data.model,
    data.error_message,
    data.duration_ms,
    created_at,
    data.completed_at
  )

  return { ...data, created_at }
}

export function getGeneration(id: string): Generation | null {
  const database = getDatabase()
  const stmt = database.prepare('SELECT * FROM generations WHERE id = ?')
  return stmt.get(id) as Generation | undefined || null
}

export function listGenerations(filter?: 'all' | 'completed' | 'failed'): Generation[] {
  const database = getDatabase()
  let query = 'SELECT * FROM generations ORDER BY created_at DESC'

  if (filter === 'completed' || filter === 'failed') {
    query = `SELECT * FROM generations WHERE status = ? ORDER BY created_at DESC`
    const stmt = database.prepare(query)
    return stmt.all(filter) as Generation[]
  }

  const stmt = database.prepare(query)
  return stmt.all() as Generation[]
}

export function updateGeneration(id: string, updates: Partial<Generation>) {
  const database = getDatabase()
  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(updates)

  const stmt = database.prepare(`UPDATE generations SET ${fields} WHERE id = ?`)
  stmt.run(...values, id)
}

export function deleteGeneration(id: string) {
  const database = getDatabase()
  const stmt = database.prepare('DELETE FROM generations WHERE id = ?')
  stmt.run(id)
}
