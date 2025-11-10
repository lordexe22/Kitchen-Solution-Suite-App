/* src/components/BranchList/BranchList.tsx */
// #section imports
import BranchAccordion from '../BranchAccordion/BranchAccordion';
import type { BranchWithLocation } from '../../store/Branches.types';
import styles from './BranchList.module.css';
// #end-section

// #interface BranchListProps
interface BranchListProps {
  branches: BranchWithLocation[];
  onEditLocation: (branch: BranchWithLocation) => void;
  onEditName: (branch: BranchWithLocation) => void;
  onEditSocials: (branch: BranchWithLocation) => void;
  onDelete: (branchId: number) => void;
}
// #end-interface

// #component BranchList
const BranchList = ({ 
  branches, 
  onEditLocation, 
  onEditName, 
  onEditSocials,
  onDelete 
}: BranchListProps) => {
  return (
    <div className={styles.list}>
      {branches.map((branch, index) => (
        <BranchAccordion
          key={branch.id}
          branch={branch}
          displayIndex={index + 1}
          onEditLocation={() => onEditLocation(branch)}
          onEditName={() => onEditName(branch)}
          onEditSocials={() => onEditSocials(branch)}
          onDelete={() => onDelete(branch.id)}
        />
      ))}
    </div>
  );
};

export default BranchList;
// #end-component