import { SvgProps } from "react-native-svg";

export type CarrouselTypes = {
    id: string;
    icon: React.FC<SvgProps>;
    onPress: () => void;
}