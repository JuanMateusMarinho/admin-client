import { Module } from '@nestjs/common';
import { SUPABASE_CLIENT, SupabaseProvider } from './supabase.provider';

@Module({
  providers: [SupabaseProvider],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}