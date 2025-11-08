/* src/components/BranchList/BranchList.tsx */
// #section imports
import type { BranchWithLocation } from '../../store/Branches.types';
import BranchAccordion from '../BranchAccordion/BranchAccordion';
import styles from './BranchList.module.css';
// #end-section

// #interface BranchListProps
interface BranchListProps {
  branches: BranchWithLocation[];
  onEditLocation: (branch: BranchWithLocation) => void;
  onEditName: (branch: BranchWithLocation) => void;
  onDelete: (branchId: number) => void;
}
// #end-interface

// #component BranchList
/**
 * Lista de sucursales como acordeones colapsables.
 */
const BranchList = ({ branches, onEditLocation, onEditName, onDelete }: BranchListProps) => {
  return (
    <div className={styles.list}>
      {branches.map((branch, index) => (
        <BranchAccordion
          key={branch.id}
          branch={branch}
          displayIndex={index + 1}
          onEditLocation={() => onEditLocation(branch)}
          onEditName={() => onEditName(branch)}
          onDelete={() => onDelete(branch.id)}
        />
      ))}
    </div>
  );
};

export default BranchList;
// #end-component