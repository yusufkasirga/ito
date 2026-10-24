import { getBlogEntries } from '../../blog/blogCatalog';
import BlogLanguageLinks from '../../blog/BlogLanguageLinks';
import { contentIndexMetadata } from '../../blog/contentPresentation';
import DeBlogIndex from './DeBlogIndex';

export function generateMetadata() { return contentIndexMetadata('de'); }

export default function BlogPage() {
  return <><div style={{ background: '#071726', color: '#fffaf1', padding: '1px 32px' }}><BlogLanguageLinks locale="de" /></div><DeBlogIndex articles={getBlogEntries('de')} /></>;
}
