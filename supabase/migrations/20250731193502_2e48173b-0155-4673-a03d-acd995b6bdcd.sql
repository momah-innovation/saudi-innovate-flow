-- Create the correct foreign key constraint for opportunity_bookmarks
ALTER TABLE public.opportunity_bookmarks 
ADD CONSTRAINT opportunity_bookmarks_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

-- Create trigger to update opportunity analytics when bookmarks change
CREATE OR REPLACE TRIGGER update_opportunity_bookmark_analytics
  AFTER INSERT OR DELETE ON public.opportunity_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_opportunity_analytics_on_bookmark();