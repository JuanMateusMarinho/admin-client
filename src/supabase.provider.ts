import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fetch from 'cross-fetch';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const SupabaseProvider: Provider = {
  provide: SUPABASE_CLIENT,
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias.');
    }

    return createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch,
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  },
  inject: [ConfigService],
};