import { extractCleanPath, getLocalizedPath } from '../constants/routes';

/**
 * Helper để navigate tới detail page với code slug
 */
export const navigateToDetail = (
  navigate: (path: string, options?: any) => void,
  location: { pathname: string },
  code: string,
  locale: string
) => {
  const cleanPath = extractCleanPath(location.pathname);
  const newPath = getLocalizedPath(`${cleanPath}/${code}`, locale);
  navigate(newPath, { replace: true });
};

/**
 * Helper để navigate quay lại list page (xóa code slug)
 */
export const navigateToList = (
  navigate: (path: string, options?: any) => void,
  basePath: string,
  locale: string
) => {
  const newPath = getLocalizedPath(basePath, locale);
  navigate(newPath, { replace: true });
};
