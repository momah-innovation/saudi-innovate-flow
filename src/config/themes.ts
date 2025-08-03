export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'role' | 'functional' | 'workspace';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    success: string;
    warning: string;
    destructive: string;
    innovation: string;
    expert: string;
    partner: string;
    innovator: string;
  };
  cssVariables: Record<string, string>;
}

export const themes: ThemeConfig[] = [
  // Default Theme
  {
    id: 'default',
    name: 'Default',
    description: 'Standard design system theme',
    category: 'functional',
    colors: {
      primary: 'hsl(262.1 83.3% 57.8%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(210 40% 95%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '262.1 83.3% 57.8%',
      '--secondary': '210 40% 95%',
      '--accent': '210 40% 95%',
      '--muted': '210 40% 95%',
    }
  },
  
  // Role-Based Themes
  {
    id: 'expert',
    name: 'Expert',
    description: 'Professional, authoritative theme for expert users',
    category: 'role',
    colors: {
      primary: 'hsl(217.2 91.2% 59.8%)',
      secondary: 'hsl(214.3 31.8% 91.4%)',
      accent: 'hsl(210 40% 95%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(262.1 83.3% 57.8%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '217.2 91.2% 59.8%',
      '--secondary': '214.3 31.8% 91.4%',
      '--accent': '210 40% 95%',
      '--muted': '210 40% 95%',
      '--expert': '217.2 91.2% 59.8%',
    }
  },
  
  {
    id: 'stakeholder',
    name: 'Stakeholder',
    description: 'Executive, strategic theme for stakeholder users',
    category: 'role',
    colors: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(47.9 95.8% 53.1%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '222.2 84% 4.9%',
      '--secondary': '210 40% 95%',
      '--accent': '47.9 95.8% 53.1%',
      '--muted': '210 40% 95%',
    }
  },
  
  {
    id: 'innovator',
    name: 'Innovator',
    description: 'Creative, dynamic theme for innovator users',
    category: 'role',
    colors: {
      primary: 'hsl(346.8 77.2% 49.8%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(280 100% 70%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '346.8 77.2% 49.8%',
      '--secondary': '210 40% 95%',
      '--accent': '280 100% 70%',
      '--muted': '210 40% 95%',
      '--innovator': '346.8 77.2% 49.8%',
      '--innovation': '280 100% 70%',
    }
  },
  
  {
    id: 'partner',
    name: 'Partner',
    description: 'Collaborative, trustworthy theme for partner users',
    category: 'role',
    colors: {
      primary: 'hsl(142.1 76.2% 36.3%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(173 58% 39%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '142.1 76.2% 36.3%',
      '--secondary': '210 40% 95%',
      '--accent': '173 58% 39%',
      '--muted': '210 40% 95%',
      '--partner': '142.1 76.2% 36.3%',
    }
  },
  
  // Functional Area Themes
  {
    id: 'challenges',
    name: 'Challenges',
    description: 'Action-oriented theme for challenge areas',
    category: 'functional',
    colors: {
      primary: 'hsl(24.6 95% 53.1%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(0 84.2% 60.2%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '24.6 95% 53.1%',
      '--secondary': '210 40% 95%',
      '--accent': '0 84.2% 60.2%',
      '--muted': '210 40% 95%',
    }
  },
  
  {
    id: 'events',
    name: 'Events',
    description: 'Social, engaging theme for events',
    category: 'functional',
    colors: {
      primary: 'hsl(262.1 83.3% 57.8%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(346.8 77.2% 49.8%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '262.1 83.3% 57.8%',
      '--secondary': '210 40% 95%',
      '--accent': '346.8 77.2% 49.8%',
      '--muted': '210 40% 95%',
    }
  },
  
  {
    id: 'campaigns',
    name: 'Campaigns',
    description: 'Marketing focused, bold theme',
    category: 'functional',
    colors: {
      primary: 'hsl(346.8 77.2% 49.8%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(47.9 95.8% 53.1%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '346.8 77.2% 49.8%',
      '--secondary': '210 40% 95%',
      '--accent': '47.9 95.8% 53.1%',
      '--muted': '210 40% 95%',
    }
  },
  
  {
    id: 'dashboards',
    name: 'Dashboards',
    description: 'Clean, analytical theme for data visualization',
    category: 'functional',
    colors: {
      primary: 'hsl(217.2 91.2% 59.8%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(210 40% 95%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '217.2 91.2% 59.8%',
      '--secondary': '210 40% 95%',
      '--accent': '210 40% 95%',
      '--muted': '210 40% 95%',
    }
  },
  
  // Workspace Themes
  {
    id: 'team',
    name: 'Team Workspace',
    description: 'Collaborative theme for team workspaces',
    category: 'workspace',
    colors: {
      primary: 'hsl(173 58% 39%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(142.1 76.2% 36.3%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '173 58% 39%',
      '--secondary': '210 40% 95%',
      '--accent': '142.1 76.2% 36.3%',
      '--muted': '210 40% 95%',
    }
  },
  
  {
    id: 'organization',
    name: 'Organization',
    description: 'Corporate theme for organizational areas',
    category: 'workspace',
    colors: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 95%)',
      accent: 'hsl(217.2 91.2% 59.8%)',
      muted: 'hsl(210 40% 95%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(47.9 95.8% 53.1%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      innovation: 'hsl(280 100% 70%)',
      expert: 'hsl(217.2 91.2% 59.8%)',
      partner: 'hsl(142.1 76.2% 36.3%)',
      innovator: 'hsl(346.8 77.2% 49.8%)',
    },
    cssVariables: {
      '--primary': '222.2 84% 4.9%',
      '--secondary': '210 40% 95%',
      '--accent': '217.2 91.2% 59.8%',
      '--muted': '210 40% 95%',
    }
  },
];

export const getThemeById = (id: string): ThemeConfig | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: ThemeConfig['category']): ThemeConfig[] => {
  return themes.filter(theme => theme.category === category);
};