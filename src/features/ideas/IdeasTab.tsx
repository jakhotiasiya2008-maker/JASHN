import React, { useState } from 'react';
import { usePlannerStore } from '../../lib/store';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { fetchPersonalizedIdeas } from '../../lib/apiClient';
import {
  Sparkles,
  Palette,
  UtensilsCrossed,
  Music,
  Lightbulb,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';

export const IdeasTab: React.FC = () => {
  const {
    intake,
    budgetPlan,
    personalizedIdeas,
    setPersonalizedIdeas,
    isGeneratingIdeas,
    setIsGeneratingIdeas,
  } = usePlannerStore();

  const [isCopied, setIsCopied] = useState(false);

  if (!intake || !budgetPlan) return null;

  // Auto-generate if not yet loaded
  const handleRegenerate = async () => {
    setIsGeneratingIdeas(true);
    const res = await fetchPersonalizedIdeas({
      vibe: intake.vibe,
      budgetINR: budgetPlan.totalBudgetINR,
      guestCount: intake.guestCount,
      selectedFunctions: intake.selectedFunctions,
    });
    setPersonalizedIdeas(res.data);
  };

  const ideas = personalizedIdeas || {
    themeTitle: 'Royal Awadhi Heritage & Saffron Elegance',
    palette: ['Antique Gold', 'Imperial Crimson', 'Warm Ivory', 'Emerald Leaf'],
    decorConcepts: [
      'Carved wooden jharokha backdrops draped in marigold and velvet curtains.',
      'Grand entryway lined with brass urli bowls floating fresh lotus flowers and scented tea lights.',
      'Regal royal court mandap illuminated with warm amber fairy lights and copper lanterns.',
      'Vintage brass centerpieces holding tuberoses and hand-tied jasmine tassels.',
    ],
    signatureMenu: [
      'Royal Awadhi Dum Biryani slow-cooked with saffron and royal spices.',
      'Dal Bukhara simmered overnight with artisanal Amritsari kulchas.',
      'Live Chaat Bazaar: Banarasi Tamatar Chaat and crisp Palak Patta Chaat.',
      'Warm Shahi Tukda topped with condensed rabri and pistachio slivers.',
    ],
    entertainmentIdeas: [
      'Authentic Rajasthani Manganiyar folk ensemble to welcome the Baraat.',
      'Classical Shehnai and Sitar jugalbandi welcoming guests at the entryway.',
      'Grand Royal entry on a floral royal palki with cold-pyro sparklers.',
    ],
    budgetSavingTips: [
      'Source marigolds from local wholesale flower mandis rather than imported flowers.',
      'Repurpose daytime Haldi brass vessels and fabric drapes for the evening Sangeet.',
      'Negotiate composite banquet lighting instead of bringing outside trussing.',
    ],
  };

  const handleCopyMoodboard = () => {
    const text = `🌸 Jashn Wedding Moodboard: ${ideas.themeTitle}\n` +
      `🎨 Palette: ${ideas.palette.join(', ')}\n\n` +
      `✨ Decor Concepts:\n${ideas.decorConcepts.map((d) => `• ${d}`).join('\n')}\n\n` +
      `🍽️ Signature Feast:\n${ideas.signatureMenu.map((m) => `• ${m}`).join('\n')}\n\n` +
      `🎶 Entertainment:\n${ideas.entertainmentIdeas.map((e) => `• ${e}`).join('\n')}\n\n` +
      `💡 Budget Hacks:\n${ideas.budgetSavingTips.map((b) => `• ${b}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-border-highlight">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-primary/20 text-accent-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-accent-primary">
              AI-Curated Cultural Personalization
            </h2>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            Personalized theme, decor moodboards, curated royal feast menus, and Sangeet entertainment matching your exact budget and vibe.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyMoodboard}
            leftIcon={isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-status-ok" /> : undefined}
          >
            {isCopied ? 'Copied to Clipboard!' : 'Share Moodboard'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRegenerate}
            isLoading={isGeneratingIdeas}
            leftIcon={<RotateCw className="h-3.5 w-3.5" />}
          >
            Regenerate Concepts
          </Button>
        </div>
      </GlassCard>

      {/* Theme Title & Palette Showcase */}
      <GlassCard className="border-border-highlight relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="accent" size="sm">Curated Aesthetic</Badge>
            <h3 className="mt-2 font-serif text-2xl font-bold text-text-primary">
              {ideas.themeTitle}
            </h3>
            <p className="text-xs text-text-muted">
              Designed for {intake.guestCount} guests in {intake.cityName || 'your city'} with a ₹{(budgetPlan.totalBudgetINR / 100000).toFixed(1)}L budget.
            </p>
          </div>

          {/* Color Palette Chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            {ideas.palette.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-card px-3 py-2 shadow-sm"
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/20 shrink-0"
                  style={{
                    backgroundColor:
                      idx === 0
                        ? 'var(--accent-primary)'
                        : idx === 1
                        ? 'var(--accent-secondary)'
                        : idx === 2
                        ? '#EC4899'
                        : '#10B981',
                  }}
                />
                <span className="text-xs font-medium text-text-primary">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 2-Column Grid: Decor & Culinary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decor Concepts */}
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Palette className="h-4 w-4 text-accent-primary" />
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Mandap & Ambience Concepts
            </h3>
          </div>
          <div className="space-y-2.5">
            {ideas.decorConcepts.map((decor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-bg-card/50 p-3 text-xs text-text-secondary leading-relaxed"
              >
                <span className="font-serif font-bold text-accent-primary">{idx + 1}.</span>
                <span>{decor}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Signature Royal Menu */}
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <UtensilsCrossed className="h-4 w-4 text-accent-primary" />
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Signature Royal Culinary Feast
            </h3>
          </div>
          <div className="space-y-2.5">
            {ideas.signatureMenu.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-bg-card/50 p-3 text-xs text-text-secondary leading-relaxed"
              >
                <span className="font-serif font-bold text-accent-primary">{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 2-Column Grid: Entertainment & Budget Saving Hacks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entertainment & Sangeet */}
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Music className="h-4 w-4 text-accent-primary" />
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Entertainment & Sangeet Spectacle
            </h3>
          </div>
          <div className="space-y-2.5">
            {ideas.entertainmentIdeas.map((ent, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-bg-card/50 p-3 text-xs text-text-secondary leading-relaxed"
              >
                <span className="font-serif font-bold text-accent-primary">{idx + 1}.</span>
                <span>{ent}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Budget Saving Tips */}
        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Lightbulb className="h-4 w-4 text-status-ok" />
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Budget Optimisation Hacks
            </h3>
          </div>
          <div className="space-y-2.5">
            {ideas.budgetSavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-status-ok/30 bg-status-ok/10 p-3 text-xs text-text-secondary leading-relaxed"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-ok" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
