-- Add whatsapp_number column to menus table
ALTER TABLE menus ADD COLUMN IF NOT EXISTS whatsapp_number text;
