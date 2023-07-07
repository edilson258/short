import {IURLRepository} from "@/repositories/URLRepository";
import {TURLData} from "@/types/URLData";
import {DataTypes, Model, Sequelize} from "sequelize";

interface IURLDataInstace extends Model<TURLData>, TURLData {}

export class PostgresURLRepository implements IURLRepository {
  private postgresClient: Sequelize;
  private URLTableName = "URLTable";

  constructor(postgresClient: Sequelize) {
    this.postgresClient = postgresClient;
    this.createTables();
  }

  private createTables = async () => {
    this.postgresClient.define<IURLDataInstace>(this.URLTableName, {
      _id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longURLHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  };

  private getURLTable() {
    // casting URLTable to get fields suggestions
    const URLTable = this.postgresClient.models.URLTable as typeof Model & {
      new (): IURLDataInstace;
    };
    return URLTable;
  }

  public storeURL = async (urlData: TURLData): Promise<void> => {
    await this.postgresClient.sync();
    await this.getURLTable().create({
      ...urlData,
    });
  };

  public queryURLByHash = async (
    longURLHash: string
  ): Promise<TURLData | null> => {
    await this.postgresClient.sync();
    return await this.getURLTable().findOne({ where: { longURLHash } });
  };
}
