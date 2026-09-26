import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { DbSession, DbMessage, SessionWithSpec } from '@/lib/supabase/types';
import { AppSpec } from '@/lib/schemas/app-spec';

export async function fetchUserSessions(userId: string): Promise<SessionWithSpec[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error.message);
    return [];
  }

  return (data || []).map((s) => ({
    ...s,
    spec: (s.spec as unknown as AppSpec) || null,
  }));
}

export async function createSession(
  userId: string,
  title: string = 'New Conversation',
  initialSpec: AppSpec | null = null
): Promise<SessionWithSpec | null> {
  if (!isSupabaseConfigured() || !userId) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      title: title || 'New Conversation',
      spec: initialSpec ? (initialSpec as unknown as any) : null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error.message);
    return null;
  }

  return {
    ...data,
    spec: (data.spec as unknown as AppSpec) || null,
  };
}

export async function updateSession(
  sessionId: string,
  updates: { title?: string; spec?: AppSpec | null }
): Promise<boolean> {
  if (!isSupabaseConfigured() || !sessionId) return false;

  const supabase = createClient();
  const payload: any = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.spec !== undefined) payload.spec = updates.spec;

  const { error } = await supabase
    .from('sessions')
    .update(payload)
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session:', error.message);
    return false;
  }

  return true;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !sessionId) return false;

  const supabase = createClient();
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error deleting session:', error.message);
    return false;
  }

  return true;
}

export async function fetchSessionMessages(sessionId: string): Promise<DbMessage[]> {
  if (!isSupabaseConfigured() || !sessionId) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error.message);
    return [];
  }

  return data || [];
}

export async function saveChatMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<DbMessage | null> {
  if (!isSupabaseConfigured() || !sessionId || !userId) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving chat message:', error.message);
    return null;
  }

  return data;
}
