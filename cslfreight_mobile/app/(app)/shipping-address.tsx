import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { axios_instance_token } from 'app/_API/axios';
import { useAndroidBackButton } from 'app/_hooks/useAndroidBackButton';
import { useQuery } from '@tanstack/react-query';
import { AddressType } from '@/types';

export default function ShippingAddressScreen() {
    useAndroidBackButton();

    const address = useQuery<AddressType[]>({
        queryKey: ["address",],
        queryFn: async () => await axios_instance_token.get(`/address`).then(res => res.data)
    })
    // const addresses = [
    //     {
    //         title: 'CHINA SEA ADDRESS',
    //         contact: 'Chocolate',
    //         mobile: '+86 18024948009',
    //         warehouseAddress: 'GH-CSL-XXX, No. 97, Lishui Avenue, Nanhai District, Foshan City, Guangdong Province (You can locate Waihui Furniture Co., Ltd. and call in advance)',
    //         shippingMark: 'GH-CSL-XXX',
    //         note: 'XXX - put your name and phone number.',
    //     },
    //     {
    //         title: 'CSL FREIGHT CHINA SHIPPING ADDRESS',
    //         contact: '朱古力',
    //         mobile: '+86 18024948009',
    //         warehouseAddress: '广东省佛山市南海区里水大道中 97 号（可以定位外晖家具有限公司提前电话联系）',
    //         shippingMark: 'GH-CSL-XXX',
    //         note: 'XXX - put your name and phone number.',
    //     },
    //     {
    //         title: 'SEA CHINA WAREHOUSE',
    //         contact: 'CHOCOLATE',
    //         mobile: '+86 18024948009',
    //         warehouseAddress: '系人consignee: 朱古力（CSL-XXX 电话mobile：+86 18024948009 仓库地址 Address：广东省佛山市南海区里水大道中 97 号（可以定位外晖家具有限公司提前电话联系） Shipping mark: GH-CSL-XXX NB: your name & call number at XXX',
    //         shippingMark: 'GH-CSL-XXX',
    //         note: 'XXX - put your name and phone number.',
    //     },


    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.white, colors.darkGray]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Our Shipping Addresses</Text>
                        <View style={styles.warningBox}>
                            <MaterialIcons name="warning" size={20} color="#F59E0B" style={styles.warningIcon} />
                            <Text style={styles.warningText}>
                                Please put your Shipping mark on all your packages with your name and contact at (XXX)
                            </Text>
                        </View>
                    </View>

                    {/* Address Cards */}
                    {address.data?.map((address, index) => (
                        <View key={index} style={styles.addressCard}>
                            <Text style={styles.addressTitle}>{address.name}</Text>

                            <View style={styles.addressSection}>
                                <Text style={styles.label}>Contact:</Text>
                                <Text style={styles.value}>{address.contact}</Text>
                            </View>

                            <View style={styles.addressSection}>
                                <Text style={styles.label}>Mobile:</Text>
                                <Text style={styles.value}>{address.mobile}</Text>
                            </View>

                            <View style={styles.addressSection}>
                                <Text style={styles.label}>Warehouse Address:</Text>
                                <Text style={styles.value}>{address.address}</Text>
                            </View>

                            <View style={styles.addressSection}>
                                <Text style={styles.label}>Shipping Mark</Text>
                                <Text style={styles.shippingMark}>GH-CSL-XXX</Text>
                            </View>

                            <View style={styles.noteBox}>
                                <MaterialIcons name="warning" size={16} color="#DC2626" style={styles.noteIcon} />
                                <Text style={styles.noteText}>Put your name and phone number at (XXX)</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    warningIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    addressCard: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addressTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    addressSection: {
        marginBottom: spacing.sm,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    shippingMark: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginTop: 2,
    },
    noteBox: {
        flexDirection: 'row',
        backgroundColor: '#FEE2E2',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
        marginTop: spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: '#DC2626',
    },
    noteIcon: {
        fontSize: 14,
        marginRight: spacing.xs,
    },
    noteText: {
        flex: 1,
        fontSize: 12,
        color: '#991B1B',
        fontWeight: '500',
    },
});
