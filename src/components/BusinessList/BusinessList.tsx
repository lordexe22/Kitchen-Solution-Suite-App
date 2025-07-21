// src/components/BusinessList/BusinessList.tsx
import styles from "./BusinessList.module.css";

type Business = {
  id: string;
  name: string;
  alias?: string;
  address?: string;
};

type Props = {
  businesses: Business[];
};

const BusinessList = ({ businesses }: Props) => {
  const getDisplayName = (b: Business, index: number) => {
    const { name, alias, address } = b;
    if (alias) return `${name} - ${alias}`;
    if (address) return `${name} - ${address}`;

    const sameNameNoAliasNoAddressBefore = businesses
      .slice(0, index)
      .filter((x) => x.name === name && !x.alias && !x.address).length;

    const label =
      sameNameNoAliasNoAddressBefore === 0 ? name : `${name} (${sameNameNoAliasNoAddressBefore})`;

    return `${label} - [ configure la dirección del local ]`;
  };

  return (
    <ul className={styles.list}>
      {businesses.map((b, i) => (
        <li key={b.id} className={styles.item}>
          {getDisplayName(b, i)}
        </li>
      ))}
    </ul>
  );
};

export default BusinessList;
