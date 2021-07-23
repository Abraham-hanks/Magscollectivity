import { Sequelize } from 'sequelize-typescript';
import { AdminModel } from 'src/modules/admin/admin.model';
import { AuthModel } from 'src/modules/auth/auth.model';
import { CustomerModel } from 'src/modules/customer/models/customer.model';
import { RealtorTreeModel } from 'src/modules/customer/models/realtor-tree.model';
import { DocumentModel } from 'src/modules/document/document.model';
import { BankAccountModel } from 'src/modules/payment/models/bank-account.model';
import { CardAuthModel } from 'src/modules/payment/models/card-auth.model';
import { ProductSubModel } from 'src/modules/product-subscription/product-sub.model';
import { PaymentPlanModel } from 'src/modules/product/models/payment-plan.model';
import { ProductModel } from 'src/modules/product/models/product.model';
import { RoleModel } from 'src/modules/role/models/role.model';
import { ScopeModel } from 'src/modules/role/models/scope.model';
import { FundRequestModel } from 'src/modules/txtn/models/fund-request.model';
import { TxtnModel } from 'src/modules/txtn/models/txtn.model';
import { WithdrawalRequestModel } from 'src/modules/txtn/models/withdrawal-request.model';
import { AuditModel } from 'src/modules/utility/models/audit.model';
import { LgaModel } from 'src/modules/utility/models/lga.model';
import { StateModel } from 'src/modules/utility/models/state.model';
import { TokenModel } from 'src/modules/utility/models/token.model';
import { WalletModel } from 'src/modules/wallet/wallet.model';
import { configService } from '../common/config/config.service';
import { SEQUELIZE } from '../common/constants';

// factory pattern is used for database setup
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize(configService.getDatabaseUrl(), configService.getSequelizeConfig());
      sequelize.addModels([
        AdminModel,
        AuditModel,
        AuthModel,
        BankAccountModel,
        CardAuthModel,
        // ChangeRequestModel,
        // ChargeModel,
        // ChargeSubscriptionModel,
        CustomerModel,
        DocumentModel,
        FundRequestModel,
        LgaModel,
        PaymentPlanModel,
        ProductModel,
        ProductSubModel,
        RealtorTreeModel,
        RoleModel,
        ScopeModel,
        StateModel,
        TokenModel,
        TxtnModel,
        WalletModel,
        WithdrawalRequestModel
      ]);
      return sequelize;
    },
  },
];
