'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, Loader2, CreditCard } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useTrial } from '@/hooks/useTrial';
import { billingService } from '@/lib/api/billing';
import { cn } from '@/lib/utils';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  reason: 'TRIAL_EXHAUSTED' | 'INSUFFICIENT_CREDITS' | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  credits: number;
  popular?: boolean;
  stripe_price_id: string;
}

/**
 * PaywallModal - Credits purchase modal
 *
 * Triggers on:
 * - TRIAL_EXHAUSTED (WebSocket close or error payload)
 * - INSUFFICIENT_CREDITS (WebSocket error payload)
 *
 * Features:
 * - Sign in prompt for anonymous users
 * - Product selection from /v1/billing/products
 * - Stripe checkout via /v1/billing/checkout
 * - Success redirect to ?checkout=success
 */
export const PaywallModal: React.FC<PaywallModalProps> = ({
  open,
  onClose,
  reason
}) => {
  const { isAuthenticated } = useAuth();
  const { isAnonymous } = useTrial();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (open && isAuthenticated) {
      loadProducts();
    }
  }, [open, isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const plans = await billingService.getPlans();

      // Convert plans to products for display
      const productsFromPlans: Product[] = plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        credits: plan.limits?.credits || 100,
        popular: plan.is_popular,
        stripe_price_id: plan.stripe_price_id
      }));

      setProducts(productsFromPlans);

      // Auto-select popular product
      const popular = productsFromPlans.find(p => p.popular);
      setSelectedProduct(popular || productsFromPlans[0] || null);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;

    try {
      setCheckingOut(true);

      const { checkout_url } = await billingService.createCheckoutSession({
        plan_id: selectedProduct.id,
        success_url: `${window.location.origin}${window.location.pathname}?checkout=success`,
        cancel_url: `${window.location.origin}${window.location.pathname}`,
      });

      // Redirect to Stripe checkout
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-basalt/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="bg-background border border-border rounded-pyramid shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="border-b border-border p-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-nile mb-1">
                    {reason === 'TRIAL_EXHAUSTED' ? 'Trial Credits Exhausted' : 'Insufficient Credits'}
                  </h2>
                  <p className="text-sm font-ui text-stone">
                    {isAnonymous
                      ? 'Sign in and add credits to continue using Prompt Teme'
                      : 'Add credits to continue using Prompt Teme'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-stone hover:text-nile transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isAnonymous ? (
                  // Sign in prompt for anonymous users
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-sun mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-nile mb-2">
                      Sign in to Continue
                    </h3>
                    <p className="text-stone font-ui mb-6">
                      Create an account or sign in to purchase credits and continue using Prompt Teme.
                    </p>
                    <a
                      href="/auth/signin?redirect=/chat"
                      className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-cartouche",
                        "bg-sun text-white font-ui font-medium",
                        "hover:bg-sun-hover transition-all",
                        "shadow-lg hover:shadow-xl"
                      )}
                    >
                      Sign In to Add Credits
                    </a>
                  </div>
                ) : loading ? (
                  // Loading state
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-sun mx-auto mb-4" />
                    <p className="text-stone font-ui">Loading credit packages...</p>
                  </div>
                ) : (
                  // Product selection
                  <div className="space-y-4">
                    <p className="text-sm font-ui text-stone mb-4">
                      Choose a credit package to continue:
                    </p>

                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={cn(
                          "w-full text-left p-4 rounded-temple border-2 transition-all",
                          "hover:border-sun/50 relative",
                          selectedProduct?.id === product.id
                            ? "border-sun bg-sun/5"
                            : "border-sand-100 bg-white"
                        )}
                      >
                        {product.popular && (
                          <span className="absolute -top-2 right-4 px-2 py-0.5 bg-sun text-white text-xs font-ui font-medium rounded-full">
                            Popular
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-heading font-semibold text-nile">{product.name}</h4>
                          <span className="text-2xl font-heading font-bold text-sun">
                            ${product.price}
                          </span>
                        </div>

                        <p className="text-sm font-ui text-stone mb-3">{product.description}</p>

                        <div className="flex items-center gap-2 text-xs font-ui text-umber">
                          <Check className="h-4 w-4 text-sun" />
                          <span>{product.credits} credits included</span>
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={handleCheckout}
                      disabled={!selectedProduct || checkingOut}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-cartouche mt-6",
                        "bg-sun text-white font-ui font-semibold text-base",
                        "hover:bg-sun-hover transition-all",
                        "shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {checkingOut ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Redirecting to checkout...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Purchase {selectedProduct?.credits || 0} Credits
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
