
CREATE POLICY "Service role inserts matches"
  ON public.matches
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role deletes matches"
  ON public.matches
  FOR DELETE
  TO service_role
  USING (true);
