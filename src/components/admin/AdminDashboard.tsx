import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useCurrency } from '../../context/CurrencyContext.js';
import { api } from '../../services/api.js';
import {
  Product,
  Order,
  User,
  Inquiry,
  PlatformSettings,
  AdminStats,
  PolicyItem,
  DeveloperProfile,
  SkillItem,
  ServiceItem,
  ExperienceItem,
  TestimonialItem,
  ProductCategory
} from '../../types/index.js';
import {
  Briefcase,
  Code2,
  Sparkles,
  Star,
  Award,
  Layers,
  Cpu,
  UserCheck,
  MessageSquare,
  Send,
  Globe,
  FileText,
  Shield,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  ExternalLink,
  DollarSign,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  Menu,
  ChevronRight,
  ShoppingBag,
  Users,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  FileCode,
  Sliders,
  TrendingUp,
  FolderOpen
} from 'lucide-react';

export const PORTFOLIO_CATEGORIES: ProductCategory[] = [
  'Portfolio Websites',
  'AI Web Applications',
  'SaaS Websites',
  'Ecommerce Websites',
  'Agency Websites',
  'Business Websites',
  'Landing Pages',
  'Restaurant Websites',
  'Custom Projects'
];

interface AdminDashboardProps {
  onBackToStore?: () => void;
  onDataChange?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onDataChange }) => {
  const { user, isAdmin, logout } = useAuth();
  const { formatPrice } = useCurrency();

  // Active Portfolio Navigation Section
  const [activeSection, setActiveSection] = useState<
    | 'overview'
    | 'projects'
    | 'services'
    | 'skills'
    | 'experience'
    | 'testimonials'
    | 'inquiries'
    | 'orders'
    | 'profile'
    | 'policies'
    | 'settings'
  >('overview');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [actionFeedback, setActionFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filters
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'new' | 'pending' | 'resolved'>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals - Project
  const [editProjectModal, setEditProjectModal] = useState<Product | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Product>>({});

  // Modals - Service
  const [editServiceModal, setEditServiceModal] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({});

  // Modals - Skill
  const [editSkillModal, setEditSkillModal] = useState<SkillItem | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<Partial<SkillItem>>({});

  // Modals - Experience
  const [editExpModal, setEditExpModal] = useState<ExperienceItem | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);
  const [expForm, setExpForm] = useState<Partial<ExperienceItem>>({});

  // Modals - Testimonial
  const [editTestimonialModal, setEditTestimonialModal] = useState<TestimonialItem | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem>>({});

  // Modals - Policy
  const [editPolicyModal, setEditPolicyModal] = useState<PolicyItem | null>(null);
  const [isNewPolicy, setIsNewPolicy] = useState(false);
  const [policyForm, setPolicyForm] = useState<Partial<PolicyItem>>({});

  // Modals - Order Inspect
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [settRes, prodRes, inqRes, ordRes, polRes, statRes] = await Promise.all([
        api.getSettings(),
        api.getAdminProducts(),
        api.getAdminInquiries(),
        api.getAdminOrders(),
        api.getPolicies(),
        api.getAdminStats('all')
      ]);

      if (settRes?.settings) {
        setSettings(settRes.settings);
        if (settRes.settings.developerProfile) {
          setProfile(settRes.settings.developerProfile);
        }
      }

      setProducts(prodRes?.products || []);
      setInquiries(inqRes?.inquiries || []);
      setOrders(ordRes?.orders || []);
      setPolicies(polRes?.policies || []);
      setStats(statRes?.stats || null);
    } catch (err: any) {
      console.error('Failed to load portfolio admin data:', err);
      showNotification('Failed to load dashboard data. Check network connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Developer Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !profile) return;
    try {
      const updatedSettings = {
        ...settings,
        developerProfile: profile
      };
      const res = await api.updateSettings(updatedSettings);
      if (res?.settings) {
        setSettings(res.settings);
        if (res.settings.developerProfile) {
          setProfile(res.settings.developerProfile);
        }
      } else {
        setSettings(updatedSettings);
      }
      onDataChange?.();
      showNotification('Developer profile updated successfully!');
    } catch (err: any) {
      showNotification(err?.message || 'Failed to update developer profile', 'error');
    }
  };

  // Projects Handlers
  const handleOpenNewProject = () => {
    setIsNewProject(true);
    setProjectForm({
      name: '',
      slug: '',
      category: 'Portfolio Websites',
      shortDescription: '',
      fullDescription: '',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      screenshots: [],
      pricePKR: 45000,
      priceUSD: 190,
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      liveDemoUrl: 'https://smartdeveloper.com',
      featured: true,
      status: 'published',
      responsive: true,
      sourceCodeIncluded: true
    });
    setEditProjectModal({} as Product);
  };

  const handleOpenEditProject = (p: Product) => {
    setIsNewProject(false);
    setProjectForm({ ...p });
    setEditProjectModal(p);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.category) {
      showNotification('Please fill in required project fields', 'error');
      return;
    }

    try {
      const rate = settings?.exchangeRateUSDToPKR || 280;
      const pkr = Number(projectForm.pricePKR) || 45000;
      const usd = projectForm.priceUSD ? Number(projectForm.priceUSD) : Math.round(pkr / rate);

      const payload: Partial<Product> = {
        ...projectForm,
        pricePKR: pkr,
        priceUSD: usd,
        status: projectForm.status || 'published',
        responsive: projectForm.responsive ?? true,
        sourceCodeIncluded: projectForm.sourceCodeIncluded ?? true
      };

      if (isNewProject) {
        await api.saveAdminProduct(payload, false);
        showNotification(`Project "${projectForm.name}" created!`);
      } else if (editProjectModal?.id) {
        await api.saveAdminProduct({ ...payload, id: editProjectModal.id }, true);
        showNotification(`Project "${projectForm.name}" updated!`);
      }
      setEditProjectModal(null);
      const res = await api.getAdminProducts();
      setProducts(res.products || []);
      onDataChange?.();
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Delete portfolio project "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteAdminProduct(id);
      showNotification(`Project "${name}" removed.`);
      setProducts(prev => prev.filter(p => p.id !== id));
      onDataChange?.();
    } catch {
      showNotification('Failed to delete project', 'error');
    }
  };

  // Services Handlers
  const handleOpenNewService = () => {
    setIsNewService(true);
    setServiceForm({
      title: '',
      slug: '',
      icon: 'globe',
      category: 'Web Engineering',
      shortDescription: '',
      fullDescription: '',
      pricePKR: 60000,
      priceUSD: 250,
      pricingModel: 'Starting From',
      deliveryTime: '5-7 Days',
      deliverables: ['Custom Codebase', 'Responsive UI', 'Documentation'],
      active: true,
      featured: true
    });
    setEditServiceModal({} as ServiceItem);
  };

  const handleOpenEditService = (s: ServiceItem) => {
    setIsNewService(false);
    setServiceForm({ ...s });
    setEditServiceModal(s);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !profile) return;
    if (!serviceForm.title) {
      showNotification('Service title is required', 'error');
      return;
    }

    const currentServices = [...(profile.services || [])];
    let updatedServices: ServiceItem[];

    if (isNewService) {
      const newSrv: ServiceItem = {
        id: 'srv-' + Date.now(),
        title: serviceForm.title.trim(),
        slug: serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: serviceForm.icon || 'globe',
        category: serviceForm.category || 'Engineering',
        shortDescription: serviceForm.shortDescription || '',
        fullDescription: serviceForm.fullDescription || '',
        pricePKR: Number(serviceForm.pricePKR) || 50000,
        priceUSD: Number(serviceForm.priceUSD) || 200,
        pricingModel: serviceForm.pricingModel || 'Starting From',
        deliveryTime: serviceForm.deliveryTime || '5 Days',
        deliverables: Array.isArray(serviceForm.deliverables)
          ? serviceForm.deliverables
          : (serviceForm.deliverables as any || '').split('\n').filter(Boolean),
        active: serviceForm.active ?? true,
        featured: serviceForm.featured ?? false
      };
      updatedServices = [newSrv, ...currentServices];
    } else {
      updatedServices = currentServices.map(s => {
        if (s.id === editServiceModal?.id) {
          return {
            ...s,
            ...serviceForm,
            deliverables: Array.isArray(serviceForm.deliverables)
              ? serviceForm.deliverables
              : (serviceForm.deliverables as any || '').split('\n').filter(Boolean)
          } as ServiceItem;
        }
        return s;
      });
    }

    const updatedProfile = { ...profile, services: updatedServices };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      setEditServiceModal(null);
      onDataChange?.();
      showNotification(`Service "${serviceForm.title}" saved successfully!`);
    } catch {
      showNotification('Failed to save service', 'error');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!settings || !profile) return;
    if (!window.confirm(`Delete service "${title}"?`)) return;

    const updatedServices = (profile.services || []).filter(s => s.id !== id);
    const updatedProfile = { ...profile, services: updatedServices };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      onDataChange?.();
      showNotification(`Service "${title}" deleted.`);
    } catch {
      showNotification('Failed to delete service', 'error');
    }
  };

  // Skills Handlers
  const handleOpenNewSkill = () => {
    setIsNewSkill(true);
    setSkillForm({
      name: '',
      category: 'Frontend',
      level: 90,
      years: 4,
      icon: 'code',
      featured: true
    });
    setEditSkillModal({} as SkillItem);
  };

  const handleOpenEditSkill = (sk: SkillItem) => {
    setIsNewSkill(false);
    setSkillForm({ ...sk });
    setEditSkillModal(sk);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !profile) return;
    if (!skillForm.name) {
      showNotification('Skill name is required', 'error');
      return;
    }

    const currentSkills = [...(profile.skills || [])];
    let updatedSkills: SkillItem[];

    if (isNewSkill) {
      const newSk: SkillItem = {
        id: 'sk-' + Date.now(),
        name: skillForm.name.trim(),
        category: skillForm.category || 'Frontend',
        level: Number(skillForm.level) || 85,
        years: Number(skillForm.years) || 3,
        icon: skillForm.icon || 'code',
        featured: skillForm.featured ?? true
      };
      updatedSkills = [...currentSkills, newSk];
    } else {
      updatedSkills = currentSkills.map(sk =>
        sk.id === editSkillModal?.id ? ({ ...sk, ...skillForm } as SkillItem) : sk
      );
    }

    const updatedProfile = { ...profile, skills: updatedSkills };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      setEditSkillModal(null);
      onDataChange?.();
      showNotification(`Skill "${skillForm.name}" saved!`);
    } catch {
      showNotification('Failed to save skill', 'error');
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!settings || !profile) return;
    if (!window.confirm(`Delete skill "${name}"?`)) return;

    const updatedSkills = (profile.skills || []).filter(sk => sk.id !== id);
    const updatedProfile = { ...profile, skills: updatedSkills };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      onDataChange?.();
      showNotification(`Skill "${name}" deleted.`);
    } catch {
      showNotification('Failed to delete skill', 'error');
    }
  };

  // Experience Handlers
  const handleOpenNewExp = () => {
    setIsNewExp(true);
    setExpForm({
      title: '',
      company: '',
      location: 'Remote',
      period: '2023 - Present',
      current: true,
      description: '',
      skills: ['React', 'TypeScript', 'Node.js']
    });
    setEditExpModal({} as ExperienceItem);
  };

  const handleOpenEditExp = (exp: ExperienceItem) => {
    setIsNewExp(false);
    setExpForm({ ...exp });
    setEditExpModal(exp);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !profile) return;
    if (!expForm.title || !expForm.company) {
      showNotification('Title and Company are required', 'error');
      return;
    }

    const currentExp = [...(profile.experience || [])];
    let updatedExp: ExperienceItem[];

    if (isNewExp) {
      const newExpItem: ExperienceItem = {
        id: 'exp-' + Date.now(),
        title: expForm.title.trim(),
        company: expForm.company.trim(),
        location: expForm.location || 'Remote',
        period: expForm.period || '2023 - Present',
        current: expForm.current ?? false,
        description: expForm.description || '',
        skills: Array.isArray(expForm.skills)
          ? expForm.skills
          : (expForm.skills as any || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      updatedExp = [newExpItem, ...currentExp];
    } else {
      updatedExp = currentExp.map(item =>
        item.id === editExpModal?.id
          ? ({
              ...item,
              ...expForm,
              skills: Array.isArray(expForm.skills)
                ? expForm.skills
                : (expForm.skills as any || '').split(',').map((s: string) => s.trim()).filter(Boolean)
            } as ExperienceItem)
          : item
      );
    }

    const updatedProfile = { ...profile, experience: updatedExp };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      setEditExpModal(null);
      onDataChange?.();
      showNotification('Experience milestone saved!');
    } catch {
      showNotification('Failed to save experience', 'error');
    }
  };

  const handleDeleteExp = async (id: string, title: string) => {
    if (!settings || !profile) return;
    if (!window.confirm(`Delete experience "${title}"?`)) return;

    const updatedExp = (profile.experience || []).filter(e => e.id !== id);
    const updatedProfile = { ...profile, experience: updatedExp };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      onDataChange?.();
      showNotification('Experience removed.');
    } catch {
      showNotification('Failed to remove experience', 'error');
    }
  };

  // Testimonials Handlers
  const handleOpenNewTestimonial = () => {
    setIsNewTestimonial(true);
    setTestimonialForm({
      clientName: '',
      clientTitle: 'Founder & CEO',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      content: '',
      projectUrl: '',
      featured: true
    });
    setEditTestimonialModal({} as TestimonialItem);
  };

  const handleOpenEditTestimonial = (t: TestimonialItem) => {
    setIsNewTestimonial(false);
    setTestimonialForm({ ...t });
    setEditTestimonialModal(t);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !profile) return;
    if (!testimonialForm.clientName || !testimonialForm.content) {
      showNotification('Client Name and Feedback Content are required', 'error');
      return;
    }

    const currentTests = [...(profile.testimonials || [])];
    let updatedTests: TestimonialItem[];

    if (isNewTestimonial) {
      const newTest: TestimonialItem = {
        id: 'test-' + Date.now(),
        clientName: testimonialForm.clientName.trim(),
        clientTitle: testimonialForm.clientTitle || 'Client',
        company: testimonialForm.company || '',
        avatar: testimonialForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: Number(testimonialForm.rating) || 5,
        content: testimonialForm.content.trim(),
        projectUrl: testimonialForm.projectUrl || '',
        featured: testimonialForm.featured ?? true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedTests = [newTest, ...currentTests];
    } else {
      updatedTests = currentTests.map(t =>
        t.id === editTestimonialModal?.id ? ({ ...t, ...testimonialForm } as TestimonialItem) : t
      );
    }

    const updatedProfile = { ...profile, testimonials: updatedTests };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      setEditTestimonialModal(null);
      onDataChange?.();
      showNotification('Client testimonial saved!');
    } catch {
      showNotification('Failed to save testimonial', 'error');
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!settings || !profile) return;
    if (!window.confirm(`Delete review from "${name}"?`)) return;

    const updatedTests = (profile.testimonials || []).filter(t => t.id !== id);
    const updatedProfile = { ...profile, testimonials: updatedTests };
    const updatedSettings = { ...settings, developerProfile: updatedProfile };

    try {
      await api.updateSettings(updatedSettings);
      setProfile(updatedProfile);
      setSettings(updatedSettings);
      onDataChange?.();
      showNotification('Testimonial removed.');
    } catch {
      showNotification('Failed to remove testimonial', 'error');
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'pending' | 'resolved') => {
    try {
      await api.updateInquiryStatus(id, status);
      setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
      showNotification(`Lead inquiry status set to "${status}".`);
    } catch {
      showNotification('Failed to update inquiry status', 'error');
    }
  };

  // Policies Handlers
  const handleOpenNewPolicy = () => {
    setIsNewPolicy(true);
    setPolicyForm({
      title: '',
      key: '',
      category: 'Licensing',
      icon: 'shield',
      content: ''
    });
    setEditPolicyModal({} as PolicyItem);
  };

  const handleOpenEditPolicy = (p: PolicyItem) => {
    setIsNewPolicy(false);
    setPolicyForm({ ...p });
    setEditPolicyModal(p);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.title || !policyForm.content) {
      showNotification('Policy title and content are required', 'error');
      return;
    }

    try {
      if (isNewPolicy) {
        const res = await api.createPolicy(policyForm);
        showNotification(`Policy "${res.policy.title}" published!`);
        setPolicies(prev => [...prev, res.policy]);
      } else if (editPolicyModal?.id) {
        const res = await api.updatePolicy(editPolicyModal.id, policyForm);
        showNotification(`Policy "${res.policy.title}" updated!`);
        setPolicies(prev => prev.map(p => (p.id === res.policy.id ? res.policy : p)));
      }
      setEditPolicyModal(null);
    } catch (err: any) {
      showNotification(err?.message || 'Failed to save policy', 'error');
    }
  };

  const handleDeletePolicy = async (id: string, title: string) => {
    if (!window.confirm(`Delete policy "${title}"?`)) return;
    try {
      await api.deletePolicy(id);
      showNotification(`Policy "${title}" removed.`);
      setPolicies(prev => prev.filter(p => p.id !== id));
    } catch {
      showNotification('Failed to delete policy', 'error');
    }
  };

  // Filtered lists
  const filteredProjects = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(projectSearch.toLowerCase()));
    const matchesCat = projectCategoryFilter === 'All' || p.category === projectCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.message.toLowerCase().includes(inquirySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredOrders = orders.filter(o => {
    return (
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase())
    );
  });

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'payment_under_review' || o.paymentStatus === 'pending_payment').length;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Notification Toast */}
      {actionFeedback && (
        <div className="fixed top-5 right-5 z-[2147483647] flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0D121F] border border-blue-500/40 text-white shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              actionFeedback.type === 'error' ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-sm font-medium">{actionFeedback.text}</span>
          <button onClick={() => setActionFeedback(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-[#090C14]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 lg:hidden text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white">Portfolio Admin Suite</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                  DEVELOPER EDITION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {profile?.fullName || 'Smart Developer'} · {profile?.headline || 'Senior Full-Stack Engineer'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="px-3 sm:px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Live Website</span>
            </button>
          )}

          <button
            onClick={loadData}
            title="Refresh Portfolio Data"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={logout}
            title="Sign Out Admin"
            className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-30 lg:static lg:z-auto transition-all duration-300 ease-in-out border-r border-white/10 bg-[#080B13] flex flex-col ${
            mobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
        >
          {/* Developer Quick Profile Card */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-white/10 bg-[#0B0F1A]/60 flex items-center gap-3">
              <img
                src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt="Developer Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/40 ring-2 ring-black shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{profile?.fullName || 'Umair Kamboh'}</div>
                <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile?.availability || 'Available for Hire'}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', label: 'Portfolio Overview', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects & Works', icon: <FolderOpen className="w-4 h-4" />, count: products.length },
              { id: 'services', label: 'Services & Offerings', icon: <Briefcase className="w-4 h-4" />, count: profile?.services?.length || 0 },
              { id: 'skills', label: 'Skills & Tech Stack', icon: <Code2 className="w-4 h-4" />, count: profile?.skills?.length || 0 },
              { id: 'experience', label: 'Career Timeline', icon: <Award className="w-4 h-4" />, count: profile?.experience?.length || 0 },
              { id: 'testimonials', label: 'Client Reviews', icon: <Star className="w-4 h-4" />, count: profile?.testimonials?.length || 0 },
              { id: 'inquiries', label: 'Client Leads & Inquiries', icon: <MessageSquare className="w-4 h-4" />, count: pendingInquiriesCount, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
              { id: 'orders', label: 'Orders & Deliveries', icon: <ShoppingBag className="w-4 h-4" />, count: pendingOrdersCount, badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
              { id: 'profile', label: 'Developer Bio & Resume', icon: <UserCheck className="w-4 h-4" /> },
              { id: 'policies', label: 'Legal & Contracts', icon: <Shield className="w-4 h-4" />, count: policies.length },
              { id: 'settings', label: 'Settings & Payment Accounts', icon: <Settings className="w-4 h-4" /> }
            ].map(item => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        active
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MAIN BODY WORKSPACE */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & PERFORMANCE */}
          {/* ========================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="relative rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-cyan-950/30 border border-blue-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-xs font-semibold text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Portfolio Management System</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Welcome, {profile?.fullName || 'Umair Kamboh'}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {profile?.tagline || 'Manage your portfolio showcase, service offerings, verified tech stack, client testimonials, and inbound project proposals from one unified control center.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={handleOpenNewProject}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                    <button
                      onClick={handleOpenNewService}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span>Add Service</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Performance Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Showcase Projects</span>
                    <div className="p-2 rounded-lg bg-blue-600/15 text-cyan-400">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{products.length}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {products.filter(p => p.featured).length} Featured on Homepage
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Active Services</span>
                    <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile?.services?.length || 4}</div>
                  <div className="text-[11px] text-slate-400">Fixed & Starting rates</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Client Inquiries</span>
                    <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{inquiries.length}</div>
                  <div className="text-[11px] text-amber-400 font-medium">
                    {pendingInquiriesCount} Awaiting Response
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Client Reviews</span>
                    <div className="p-2 rounded-lg bg-emerald-600/15 text-emerald-400">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{profile?.testimonials?.length || 3}</div>
                  <div className="text-[11px] text-emerald-400 font-medium">5.0 Star Average</div>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('projects')}
                  className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 hover:border-blue-500/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400">
                      <FolderOpen className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">Portfolio Projects</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage web apps, live preview links, source code archives, and category tags.</p>
                </button>

                <button
                  onClick={() => setActiveSection('services')}
                  className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 hover:border-indigo-500/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                      <Briefcase className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300">Service Offerings</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure full-stack development, SaaS MVPs, pricing, and project turnaround times.</p>
                </button>

                <button
                  onClick={() => setActiveSection('inquiries')}
                  className="p-5 rounded-2xl bg-[#0C1019] border border-white/10 hover:border-amber-500/40 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300">Client Proposals & Leads</h3>
                  <p className="text-xs text-slate-400 mt-1">Review inbound hire requests, budgets, messages, and respond directly via WhatsApp.</p>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PORTFOLIO PROJECTS SHOWCASE */}
          {/* ========================================================= */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Portfolio Projects & Works</h2>
                  <p className="text-xs text-slate-400">
                    Showcase of ready-made websites, full-stack applications, and client case studies.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewProject}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by project name, tech stack, or description..."
                    value={projectSearch}
                    onChange={e => setProjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0C1019] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={projectCategoryFilter}
                  onChange={e => setProjectCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0C1019] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Categories ({products.length})</option>
                  {PORTFOLIO_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-white/10 bg-[#0C1019] overflow-hidden flex flex-col group hover:border-blue-500/40 transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-black/60 overflow-hidden">
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-semibold text-cyan-300 border border-white/10">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="px-2 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-black" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {p.shortDescription}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(p.technologies || []).slice(0, 4).map(tech => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Pricing / Value</div>
                          <div className="text-xs font-bold text-white">
                            {formatPrice(p.pricePKR, p.priceUSD)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {p.liveDemoUrl && (
                            <a
                              href={p.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Live Demo"
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEditProject(p)}
                            title="Edit Project"
                            className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id, p.name)}
                            title="Delete Project"
                            className="p-2 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SERVICES & OFFERINGS */}
          {/* ========================================================= */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Services & Capabilities</h2>
                  <p className="text-xs text-slate-400">
                    Define client offerings, delivery timelines, pricing tiers, and deliverables.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewService}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(profile?.services || []).map(s => (
                  <div
                    key={s.id}
                    className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                          {s.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {s.deliveryTime}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white">{s.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.shortDescription}</p>

                      <div className="mt-4 space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">Deliverables Included:</div>
                        <ul className="space-y-1">
                          {(s.deliverables || []).map((d, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">{s.pricingModel}</div>
                        <div className="text-sm font-bold text-white">
                          {formatPrice(s.pricePKR, s.priceUSD)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditService(s)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id, s.title)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SKILLS & TECH STACK */}
          {/* ========================================================= */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Skills & Tech Stack</h2>
                  <p className="text-xs text-slate-400">
                    Manage programming languages, frameworks, databases, and proficiency percentages.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewSkill}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Skill</span>
                </button>
              </div>

              {/* Grouped by Categories */}
              {['Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'AI & Tools'].map(cat => {
                const catSkills = (profile?.skills || []).filter(sk => sk.category === cat);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span>{cat} Engineering</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {catSkills.map(sk => (
                        <div
                          key={sk.id}
                          className="p-4 rounded-xl border border-white/10 bg-[#0C1019] flex items-center justify-between group hover:border-cyan-500/40 transition-all"
                        >
                          <div className="flex-1 pr-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-white">{sk.name}</span>
                              <span className="text-[11px] font-mono text-cyan-400 font-bold">{sk.level}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                style={{ width: `${sk.level}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1.5">{sk.years} years experience</div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditSkill(sk)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(sk.id, sk.name)}
                              className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CAREER EXPERIENCE TIMELINE */}
          {/* ========================================================= */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Career Milestones & Experience</h2>
                  <p className="text-xs text-slate-400">
                    Showcase engineering history, positions held, key responsibilities, and achievements.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewExp}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {(profile?.experience || []).map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] relative flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800/40">
                          {exp.period}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                            Current Role
                          </span>
                        )}
                        <span className="text-xs text-slate-400">· {exp.location}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{exp.title}</h3>
                      <div className="text-xs font-semibold text-cyan-400">{exp.company}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {(exp.skills || []).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <button
                        onClick={() => handleOpenEditExp(exp)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id, exp.title)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: CLIENT REVIEWS & TESTIMONIALS */}
          {/* ========================================================= */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Client Reviews & Testimonials</h2>
                  <p className="text-xs text-slate-400">
                    Build instant trust with verified endorsements, ratings, and quotes from clients.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewTestimonial}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(profile?.testimonials || []).map(t => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0C1019] flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{t.content}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={t.avatar}
                          alt={t.clientName}
                          className="w-9 h-9 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{t.clientName}</div>
                          <div className="text-[10px] text-slate-400">{t.clientTitle} · {t.company}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTestimonial(t)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id, t.clientName)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: CLIENT LEADS & HIRE INQUIRIES */}
          {/* ========================================================= */}
          {activeSection === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Client Proposals & Inquiries</h2>
                  <p className="text-xs text-slate-400">
                    Track client messages, custom quote submissions, project scopes, and follow-ups.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'new', 'pending', 'resolved'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setInquiryStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        inquiryStatusFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0C1019] text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredInquiries.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#0C1019] space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
                    <div className="text-sm font-bold text-white">No inquiries found</div>
                    <div className="text-xs text-slate-400">New leads from the contact form will appear here.</div>
                  </div>
                ) : (
                  filteredInquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl border border-white/10 bg-[#0C1019] flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              inq.status === 'new'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : inq.status === 'pending'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {inq.status}
                          </span>
                          <span className="text-xs font-bold text-white">{inq.name}</span>
                          <span className="text-xs text-slate-400">({inq.email})</span>
                          {inq.phone && <span className="text-xs text-slate-400">· {inq.phone}</span>}
                          <span className="text-[10px] text-slate-500">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {inq.budget && (
                          <div className="text-xs text-cyan-400 font-medium">
                            Project Budget: <span className="font-bold text-white">{inq.budget}</span>
                            {inq.timeline && <span> · Timeline: {inq.timeline}</span>}
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-xl border border-white/5">
                          {inq.message}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${inq.name}! Thank you for reaching out regarding your project proposal.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${inq.email}?subject=Project Proposal Response — ${profile?.fullName || 'Smart Developer'}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Client</span>
                        </a>

                        <div className="flex items-center gap-1 pt-1">
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                            className="flex-1 px-2 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold rounded cursor-pointer"
                          >
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'pending')}
                            className="flex-1 px-2 py-1 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/40 text-blue-400 text-[10px] font-semibold rounded cursor-pointer"
                          >
                            In Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: ORDERS & DELIVERIES */}
          {/* ========================================================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Orders & Deliveries</h2>
                  <p className="text-xs text-slate-400">
                    Verify client payment receipts (JazzCash, Easypaisa, Bank Transfer, Stripe) and deliver files.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search order or client..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-[#0C1019] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0C1019] overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#090C14] text-[11px] text-slate-400 uppercase font-mono border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Order</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Item</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No orders matching search
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-mono font-bold text-white">{o.orderNumber}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-white">{o.customerName}</div>
                            <div className="text-[10px] text-slate-400">{o.customerEmail}</div>
                          </td>
                          <td className="p-3.5 font-medium text-white">{o.productName}</td>
                          <td className="p-3.5 font-bold text-white">{o.currency} {o.packagePrice.toLocaleString()}</td>
                          <td className="p-3.5 uppercase font-mono text-[10px]">{o.paymentMethod}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                o.paymentStatus === 'paid' || o.paymentStatus === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : o.paymentStatus === 'payment_under_review'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}
                            >
                              {o.paymentStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setInspectOrder(o)}
                              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: DEVELOPER PROFILE & RESUME */}
          {/* ========================================================= */}
          {activeSection === 'profile' && profile && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Developer Profile & Bio</h2>
                <p className="text-xs text-slate-400">
                  Update your public resume details, avatar photo, headline, hourly rate, and social links.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Personal & Professional Info</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                      <input
                        type="text"
                        value={profile.headline}
                        onChange={e => setProfile({ ...profile, headline: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={e => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
                      <select
                        value={profile.availability}
                        onChange={e => setProfile({ ...profile, availability: e.target.value as any })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      >
                        <option value="Available for Hire">Available for Hire</option>
                        <option value="Open to Contracts">Open to Contracts</option>
                        <option value="Busy / Selective">Busy / Selective</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                      <input
                        type="text"
                        value={profile.avatar}
                        onChange={e => setProfile({ ...profile, avatar: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Download URL</label>
                      <input
                        type="text"
                        value={profile.resumeUrl}
                        onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate (PKR)</label>
                      <input
                        type="number"
                        value={profile.hourlyRatePKR}
                        onChange={e => setProfile({ ...profile, hourlyRatePKR: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Rate (USD)</label>
                      <input
                        type="number"
                        value={profile.hourlyRateUSD}
                        onChange={e => setProfile({ ...profile, hourlyRateUSD: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline Pitch</label>
                    <input
                      type="text"
                      value={profile.tagline}
                      onChange={e => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Biography / About Me</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Developer Profile</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: LEGAL & CONTRACT POLICIES */}
          {/* ========================================================= */}
          {activeSection === 'policies' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Platform & Contract Policies</h2>
                  <p className="text-xs text-slate-400">
                    Manage licensing terms, freelance contracts, delivery guidelines, and refund guarantees.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewPolicy}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Policy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map(p => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0C1019] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-600/20 text-cyan-300 text-[10px] font-mono border border-blue-500/30">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-slate-500">Key: {p.key}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3 mt-1 leading-relaxed">
                        {p.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        Updated {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditPolicy(p)}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white rounded text-xs font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(p.id, p.title)}
                          className="p-1 rounded bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: SETTINGS & PAYMENT ACCOUNTS */}
          {/* ========================================================= */}
          {activeSection === 'settings' && settings && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Platform Settings & Payment Accounts</h2>
                <p className="text-xs text-slate-400">
                  Configure local Pakistan payments (JazzCash, Easypaisa, Bank) and general store settings.
                </p>
              </div>

              <form
                onSubmit={async e => {
                  e.preventDefault();
                  try {
                    const res = await api.updateSettings(settings);
                    if (res?.settings) {
                      setSettings(res.settings);
                      if (res.settings.developerProfile) {
                        setProfile(res.settings.developerProfile);
                      }
                    }
                    onDataChange?.();
                    showNotification('Platform settings updated successfully.');
                  } catch (err: any) {
                    showNotification(err?.message || 'Failed to update settings', 'error');
                  }
                }}
                className="space-y-6 max-w-3xl"
              >
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] space-y-4">
                  <h3 className="text-sm font-bold text-white">General & Support Channels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={settings.websiteName}
                        onChange={e => setSettings({ ...settings, websiteName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Support Number</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">USD to PKR Exchange Rate</label>
                      <input
                        type="number"
                        value={settings.exchangeRateUSDToPKR}
                        onChange={e => setSettings({ ...settings, exchangeRateUSDToPKR: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/10 bg-[#0C1019] space-y-4">
                  <h3 className="text-sm font-bold text-white">JazzCash & Easypaisa Accounts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">JazzCash Account Title</label>
                      <input
                        type="text"
                        value={settings.paymentAccounts.jazzcash.accountTitle}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            paymentAccounts: {
                              ...settings.paymentAccounts,
                              jazzcash: { ...settings.paymentAccounts.jazzcash, accountTitle: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">JazzCash Account Number</label>
                      <input
                        type="text"
                        value={settings.paymentAccounts.jazzcash.accountNumber}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            paymentAccounts: {
                              ...settings.paymentAccounts,
                              jazzcash: { ...settings.paymentAccounts.jazzcash, accountNumber: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Easypaisa Account Title</label>
                      <input
                        type="text"
                        value={settings.paymentAccounts.easypaisa.accountTitle}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            paymentAccounts: {
                              ...settings.paymentAccounts,
                              easypaisa: { ...settings.paymentAccounts.easypaisa, accountTitle: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Easypaisa Account Number</label>
                      <input
                        type="text"
                        value={settings.paymentAccounts.easypaisa.accountNumber}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            paymentAccounts: {
                              ...settings.paymentAccounts,
                              easypaisa: { ...settings.paymentAccounts.easypaisa, accountNumber: e.target.value }
                            }
                          })
                        }
                        className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Platform Settings</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT PROJECT */}
      {/* ========================================================= */}
      {editProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewProject ? 'Add New Portfolio Project' : 'Edit Project Details'}
              </h3>
              <button onClick={() => setEditProjectModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projectForm.name || ''}
                    onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={projectForm.category || 'Portfolio Websites'}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  >
                    {PORTFOLIO_CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live Demo Link</label>
                  <input
                    type="text"
                    value={projectForm.liveDemoUrl || ''}
                    onChange={e => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={projectForm.pricePKR || 45000}
                    onChange={e => setProjectForm({ ...projectForm, pricePKR: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={projectForm.thumbnail || ''}
                  onChange={e => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={(projectForm.technologies || []).join(', ')}
                  onChange={e =>
                    setProjectForm({
                      ...projectForm,
                      technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={projectForm.shortDescription || ''}
                  onChange={e => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.featured ?? false}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded bg-black border-white/20 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Showcase as Featured Project</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditProjectModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT SERVICE */}
      {/* ========================================================= */}
      {editServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewService ? 'Add Service Offering' : 'Edit Service Details'}
              </h3>
              <button onClick={() => setEditServiceModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={serviceForm.title || ''}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Custom SaaS Engineering"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={serviceForm.category || ''}
                    onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
                    placeholder="e.g. Web Engineering"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={serviceForm.deliveryTime || ''}
                    onChange={e => setServiceForm({ ...serviceForm, deliveryTime: e.target.value })}
                    placeholder="e.g. 5-7 Days"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Starting Price (PKR)</label>
                  <input
                    type="number"
                    value={serviceForm.pricePKR || 50000}
                    onChange={e => setServiceForm({ ...serviceForm, pricePKR: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Starting Price (USD)</label>
                  <input
                    type="number"
                    value={serviceForm.priceUSD || 200}
                    onChange={e => setServiceForm({ ...serviceForm, priceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={serviceForm.shortDescription || ''}
                  onChange={e => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Deliverables (one per line)</label>
                <textarea
                  rows={3}
                  value={
                    Array.isArray(serviceForm.deliverables)
                      ? serviceForm.deliverables.join('\n')
                      : (serviceForm.deliverables as any) || ''
                  }
                  onChange={e => setServiceForm({ ...serviceForm, deliverables: e.target.value.split('\n') })}
                  placeholder="Production TypeScript code&#10;REST API & Database&#10;Cloud Deployment Guide"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditServiceModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT SKILL */}
      {/* ========================================================= */}
      {editSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewSkill ? 'Add New Skill' : 'Edit Skill'}
              </h3>
              <button onClick={() => setEditSkillModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={skillForm.name || ''}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React & Next.js"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={skillForm.category || 'Frontend'}
                    onChange={e => setSkillForm({ ...skillForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="AI & Tools">AI & Tools</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Proficiency ({skillForm.level || 90}%)</label>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={skillForm.level || 90}
                    onChange={e => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                    className="w-full mt-2 accent-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={skillForm.years || 3}
                  onChange={e => setSkillForm({ ...skillForm, years: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditSkillModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT EXPERIENCE */}
      {/* ========================================================= */}
      {editExpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewExp ? 'Add Experience Milestone' : 'Edit Experience'}
              </h3>
              <button onClick={() => setEditExpModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Role / Title *</label>
                  <input
                    type="text"
                    value={expForm.title || ''}
                    onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                    placeholder="e.g. Lead Full-Stack Architect"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company / Studio *</label>
                  <input
                    type="text"
                    value={expForm.company || ''}
                    onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. Smart Developer Studio"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Period</label>
                  <input
                    type="text"
                    value={expForm.period || ''}
                    onChange={e => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="e.g. 2022 - Present"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={expForm.location || ''}
                    onChange={e => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="e.g. Remote / Lahore"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Key Responsibilities & Achievements</label>
                <textarea
                  rows={3}
                  value={expForm.description || ''}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills Used (comma separated)</label>
                <input
                  type="text"
                  value={(expForm.skills || []).join(', ')}
                  onChange={e =>
                    setExpForm({
                      ...expForm,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditExpModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT TESTIMONIAL */}
      {/* ========================================================= */}
      {editTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewTestimonial ? 'Add Client Endorsement' : 'Edit Endorsement'}
              </h3>
              <button onClick={() => setEditTestimonialModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={testimonialForm.clientName || ''}
                    onChange={e => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={testimonialForm.clientTitle || ''}
                    onChange={e => setTestimonialForm({ ...testimonialForm, clientTitle: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={testimonialForm.company || ''}
                    onChange={e => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    placeholder="e.g. Nova Digital"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonialForm.rating || 5}
                    onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={testimonialForm.avatar || ''}
                  onChange={e => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  value={testimonialForm.content || ''}
                  onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditTestimonialModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT POLICY */}
      {/* ========================================================= */}
      {editPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isNewPolicy ? 'Publish Contract Policy' : 'Edit Policy'}
              </h3>
              <button onClick={() => setEditPolicyModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Policy Title *</label>
                  <input
                    type="text"
                    value={policyForm.title || ''}
                    onChange={e => setPolicyForm({ ...policyForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={policyForm.category || ''}
                    onChange={e => setPolicyForm({ ...policyForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">URL Key / Slug</label>
                <input
                  type="text"
                  value={policyForm.key || ''}
                  onChange={e => setPolicyForm({ ...policyForm, key: e.target.value })}
                  placeholder="e.g. freelance-contract"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Legal Content *</label>
                <textarea
                  rows={6}
                  value={policyForm.content || ''}
                  onChange={e => setPolicyForm({ ...policyForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white leading-relaxed font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditPolicyModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INSPECT ORDER & RECEIPT */}
      {/* ========================================================= */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0C1019] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Order Details: {inspectOrder.orderNumber}</h3>
              <button onClick={() => setInspectOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-white font-bold">{inspectOrder.productName}</div>
                <div>Client: {inspectOrder.customerName} ({inspectOrder.customerEmail})</div>
                <div>Amount: {inspectOrder.currency} {inspectOrder.packagePrice.toLocaleString()} via {inspectOrder.paymentMethod}</div>
                {inspectOrder.paymentReference && <div>TRX Reference: {inspectOrder.paymentReference}</div>}
              </div>

              {inspectOrder.receiptUrl && (
                <div>
                  <div className="font-semibold text-white mb-1.5">Submitted Payment Screenshot:</div>
                  <img
                    src={inspectOrder.receiptUrl}
                    alt="Payment Proof"
                    className="w-full max-h-72 object-contain rounded-xl border border-white/10 bg-black"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={async () => {
                    try {
                      await api.verifyPayment(inspectOrder.id);
                      showNotification('Payment verified & order marked paid!');
                      setInspectOrder(null);
                      const res = await api.getAdminOrders();
                      setOrders(res.orders || []);
                    } catch {
                      showNotification('Failed to verify payment', 'error');
                    }
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Verify Payment & Release Source Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
