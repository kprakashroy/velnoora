import Link from 'next/link';
import { pathOr } from 'ramda';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

import { products } from '@/data/content';
import { createClient as createServerSupabase } from '@/lib/supabase-server';
import ButtonCircle3 from '@/shared/Button/ButtonCircle3';

import SectionMoreProducts from './SectionMoreProducts';
import SectionProductHeader from './SectionProductHeader';
// import SectionProductInfo from './SectionProductInfo';

type Props = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

type DbProduct = {
  id: string;
  amount: number;
  currency: string | null;
  description: string | null;
  main_image_url: string | null;
  images: string[] | null;
  available_sizes: string[] | null;
  available_colors: string[] | null;
  category: string | null;
};

const getProductData = async (id: string) => {
  // Try DB first
  const supabase = createServerSupabase();
  const { data: dbProduct } = await supabase
    .from('products')
    .select(
      'id, amount, currency, description, main_image_url, images, available_sizes, available_colors, category',
    )
    .eq('id', id)
    .single();

  if (dbProduct) {
    const p = dbProduct as DbProduct;
    const imagesArray = (p.images || []).filter(Boolean) as string[];
    const mainImage = p.main_image_url || '';
    const shots = mainImage
      ? [mainImage, ...imagesArray.filter((url) => url !== mainImage)]
      : imagesArray.length > 0
        ? imagesArray
        : ['/preview.jpg'];

    return {
      slug: p.id,
      productName: p.description || 'Product',
      price: Number(p.amount || 0),
      currency: p.currency || 'USD',
      description: p.description || '',
      shots,
      availableSizes: p.available_sizes || undefined,
      availableColors: p.available_colors || undefined,
      category: p.category || null,
      reviews: 0,
    } as any;
  }

  // Fallback to static
  return products.find((item) => item.slug === id);
};

const SingleProductPage = async (props: Props) => {
  const selectedProduct = await getProductData(props.params.productId);

  return (
    <div className="container">
      <Link href="/products" className="mb-10">
        <ButtonCircle3 size="w-10 h-10" className="border border-neutral-300">
          <MdArrowBack className="text-2xl" />
        </ButtonCircle3>
      </Link>

      <div className="mb-20">
        <SectionProductHeader
          shots={pathOr([], ['shots'], selectedProduct)}
          productName={pathOr('', ['productName'], selectedProduct)}
          price={pathOr(0, ['price'], selectedProduct)}
          currency={pathOr('USD', ['currency'], selectedProduct)}
          reviews={pathOr(0, ['reviews'], selectedProduct)}
          description={pathOr('', ['description'], selectedProduct)}
          availableSizes={pathOr(
            undefined,
            ['availableSizes'],
            selectedProduct,
          )}
          availableColors={pathOr(
            undefined,
            ['availableColors'],
            selectedProduct,
          )}
        />
      </div>
      <div className="mb-28">
        <SectionMoreProducts 
          category={pathOr(null, ['category'], selectedProduct)}
          currentProductId={props.params.productId}
        />
      </div>
    </div>
  );
};

export default SingleProductPage;
