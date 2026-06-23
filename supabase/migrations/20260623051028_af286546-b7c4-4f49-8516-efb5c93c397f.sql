GRANT EXECUTE ON FUNCTION public.are_users_matched(uuid, uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_match_participant(uuid, uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;