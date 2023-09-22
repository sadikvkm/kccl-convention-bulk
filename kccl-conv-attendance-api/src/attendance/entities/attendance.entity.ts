import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class ConventionAttendance extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint' })
    userId: number;

    @Column({ type: 'smallint' })
    gate: number;

    @Column({ type: "timestamp", default: () => 'CURRENT_TIMESTAMP'})
    created_at: Timestamp;

}
