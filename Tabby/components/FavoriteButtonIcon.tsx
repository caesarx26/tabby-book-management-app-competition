import React from 'react';
import { Svg, Path } from 'react-native-svg';
const FavoriteButtonIcon: React.FC<{ isFavorite: boolean, StrokeColor?: string, size?: number }> = ({ isFavorite, StrokeColor, size }) => {

    const fillColor = isFavorite ? "#990000" : "transparent";
    const strokeColor = StrokeColor ? StrokeColor : "#33363F";

    const strokeWidth = StrokeColor !== undefined && isFavorite ? 0 : 3;
    const height = size || 45;
    const width = size || 45;

    return (
        <Svg width={width} height={height} viewBox="0 0 45 45" fill="none" >
            <Path d="M8.34501 26.0779L21.8153 38.7318C22.1398 39.0366 22.302 39.189 22.5 39.189C22.698 39.189 22.8602 39.0366 23.1847 38.7318L36.655 26.0779C37.1251 25.6363 37.3601 25.4155 37.5514 25.212C40.4416 22.1381 40.8083 17.4691 38.4336 13.9816C38.2764 13.7508 38.0788 13.496 37.6834 12.9864L37.1034 12.2388C37.026 12.1391 36.9873 12.0892 36.9592 12.0538C33.3055 7.45292 26.1044 8.22839 23.5139 13.5017C23.494 13.5423 23.4669 13.5991 23.4127 13.7127L23.4125 13.7131L23.397 13.7453C23.0304 14.4894 21.9696 14.4894 21.603 13.7453L21.5875 13.7131C21.5332 13.5992 21.506 13.5423 21.4861 13.5017C18.8956 8.22839 11.6945 7.45292 8.04077 12.0538C8.01266 12.0892 7.97401 12.1391 7.89673 12.2387L7.89664 12.2388L7.3166 12.9864L7.31659 12.9864C6.92123 13.496 6.72355 13.7508 6.56637 13.9816C4.19166 17.4691 4.55844 22.1381 7.44858 25.212C7.63988 25.4155 7.87491 25.6363 8.34497 26.0779L8.34501 26.0779Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        </Svg>

    )

};

export default FavoriteButtonIcon;
